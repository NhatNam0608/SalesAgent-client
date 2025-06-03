import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useEffect } from 'react';
import {gapi} from 'gapi-script';

import AccountPage from './pages/AccountPage/AccountPage';
import SalesPage from './pages/SalesPage/SalesPage';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import MapPage from './pages/MapPage/MapPage';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'

import { UserProvider } from './contexts/UserContext';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function App() {
  useEffect(() => {
    function start() {
      gapi.auth2.init({
        clientId: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      });
    }

    gapi.load('client:auth2', start);
  }, []);
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
