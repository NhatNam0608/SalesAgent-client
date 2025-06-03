import axios from 'axios';
import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import './JSONDisplay.css';

const API_BASE = process.env.REACT_APP_API_BASE;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const JSONDisplay = ({ toast }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [selectedMessageID, setSelectedMessageID] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendMessages, setIsSendMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('status');
  const [role, setRole] = useState('employee');
  const [titles, setTitles] = useState(() => {
    const stored = localStorage.getItem("titles");
    return stored ? JSON.parse(stored) : [];
  });
  const [inputTitles, setInputTitles] = useState(titles.join(', '));

  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [crawlStatus, setCrawlStatus] = useState('idle'); // idle | loading
  const [generateStatus, setGenerateStatus] = useState('idle');
  const handleCrawl = async (parsedTitles) => {
    setCrawlStatus('loading');
    try {
      await axios.post(`${API_BASE}/linkedin-factories/crawl`,
       parsedTitles,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Accept': 'application/json'
        }
      });
      
      toast.success('✅ Crawling successful!');
    } catch (error) {
      console.error('Crawl failed:', error);
      toast.error('❌ Crawling failed!');
    } finally {
      setCrawlStatus('idle');
    }
  };
  
  const handleGenerate = async () => {
    setGenerateStatus('loading');
    try {
      const response = await axios.post(
          `${API_BASE}/linkedin-factories/generate`,
          null, // <-- Không có body nên để `null`
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
              'Accept': 'application/json'
            }
          }
        );
      console.log('Generate response:', response.data);
      toast.success('✅ Generation successful!');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('❌ Generation failed!');
    } finally {
      setGenerateStatus('idle');
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/linkedin-factories/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Accept': 'application/json'
        }
      });
      setData(response.data);
      toast.success('✅ Data loaded successfully.');
    } catch (error) {
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);
  useEffect(() => {
    if (roleModalOpen) {
      setInputTitles(titles.join(', '));
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleModalOpen, titles]);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (message, isSend = false, id = '') => {
    setSelectedMessage(message);
    setSelectedMessageID(id);
    setIsModalOpen(true);
    setIsSendMessages(isSend);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage('');
    setSelectedMessageID('');
  };

  const handleSendMessage = async () => {
    setIsSending(true);
    try {
      await axios.post(
        `${API_BASE}/linkedin-factories/send-message`,
        null, // body là null
        {
          params: { id: selectedMessageID },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            Accept: 'application/json',
          },
        }
      );
      toast.success('✅ Message sent successfully!');
    } catch (error) {
      toast.error(`❌ Failed to send message: ${error.message}`);
    } finally {
      setIsSending(false);
      closeModal();
      fetchData();
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return "init";
      case 1: return "crawled";
      case 2: return "generated";
      case 3: return "sent";
      case 4: return "failed";
      case 5: return "completed";
      default: return "unkn";
    }
  };

  const role_data = React.useMemo(
    () =>
      [...data].filter((item) => role === 'employee' ? item.role !== 'ceo' : item.role === 'ceo'),
    [data, role],
  );

  const visibleRows = React.useMemo(
    () =>
      [...role_data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, role_data],
  );

  return (
    <div className="json-display-wrapper">
      <div className="json-display-container">
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <button className='button' onClick={()=>setRoleModalOpen(true)} disabled={crawlStatus === 'loading'}>
              {crawlStatus === 'loading' ? 'Crawling...' : 'Crawl'}
            </button>
            <button className='button' onClick={handleGenerate} disabled={generateStatus === 'loading'}>
              {generateStatus === 'loading' ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="ceo">CEO</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {visibleRows.length > 0 && (
              <TableContainer component={Paper} sx={{ marginTop: 2, width: '100%', height: "65vh", overflowX: 'hidden', padding: '4px 8px' }}>
                <Table
                  sx={{
                    minWidth: 650,
                    fontSize: '14px',
                    color: '#333',
                    '& th, & td': {
                      fontSize: '12px',
                      padding: '4px',
                      maxWidth: 200,
                    },
                  }}
                  aria-label="json data table"
                >
                  <TableHead>
                    <TableRow>
                      {[
                        { id: 'query', label: 'query' },
                        { id: 'fullName', label: 'full name' },
                        { id: 'jobTitle', label: 'title' },
                        { id: 'profileUrl', label: 'profile' },
                        { id: 'companyName', label: 'company' },
                        { id: 'companyUrl', label: 'url' },
                        { id: 'companyID', label: 'id' },
                        { id: 'status', label: 'status' },
                      ].map((column) => (
                        <TableCell
                          key={column.id}
                          sortDirection={orderBy === column.id ? order : false}
                          sx={{ fontWeight: 'bold' }}
                        >
                          <TableSortLabel
                            active={orderBy === column.id}
                            direction={orderBy === column.id ? order : 'asc'}
                            onClick={() => handleRequestSort(column.id)}
                          >
                            {column.label}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                      <TableCell sx={{ fontWeight: 'bold' }}>desc</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>message</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleRows.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.query}</TableCell>
                        <TableCell>{item.fullName}</TableCell>
                        <TableCell>{item.jobTitle}</TableCell>
                        <TableCell
                          sx={{ maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          <a href={item.profileUrl} target="_blank" rel="noreferrer" className="json-link">
                            {item.profileUrl}
                          </a>
                        </TableCell>
                        <TableCell>{item.companyName}</TableCell>
                        <TableCell
                          sx={{ maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          <a href={item.companyUrl} target="_blank" rel="noreferrer" className="json-link">
                            {item.companyUrl}
                          </a>
                        </TableCell>
                        <TableCell>{item.companyID}</TableCell>
                        <TableCell>{getStatusText(item.status)}</TableCell>
                        <TableCell>
                          <button className="json-button view-button" onClick={() => openModal(item.description, false)}>
                            view
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            className="json-button view-button"
                            onClick={() => openModal(item.outreachMessage, true, item.id)}
                            disabled={!item.outreachMessage}
                          >
                            view
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={role_data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
        {console.log(roleModalOpen)}
        <Modal
          isOpen={roleModalOpen}
          onRequestClose={() => setRoleModalOpen(false)}
          contentLabel="Enter Titles"
          className="json-modal"
          overlayClassName="json-overlay"
        >
          <h2>Enter Titles (comma-separated)</h2>
          <input
            type="text"
            value={inputTitles}
            onChange={(e) => setInputTitles(e.target.value)}
            placeholder="e.g., CEO, CTO, Manager"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
            <button
              className="json-button"
              style={{padding:"8px 16px" }}
              onClick={() => {
                const parsedTitles = inputTitles
                .split(',')
                .map((title) => title.trim().toLowerCase())
                .filter((t) => t);

                setTitles(parsedTitles);
                console.log("parsedTitles", parsedTitles)
                localStorage.setItem('titles', JSON.stringify(parsedTitles));
                setRoleModalOpen(false);
                handleCrawl(parsedTitles);
              }}
            >
              OK
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Modal"
          className="json-modal"
          overlayClassName="json-overlay"
        >
          <pre style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage}</pre>
          <div className="modal-button-group">
            {isSendMessages && (
              <button className="json-button send-button" onClick={handleSendMessage} disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Message'}
                {isSending && <span className="loader-spinner" />}
              </button>
            )}
            <button className="json-button close-button" onClick={closeModal} disabled={isSending}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default JSONDisplay;
