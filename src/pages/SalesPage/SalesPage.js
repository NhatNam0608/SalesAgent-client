import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../../components/Layout/Layout';
import JSONDisplay from '../../components/JSONDisplay/JSONDisplay';
import './SalesPage.css'; 
function SalesPage() {
  return (
    <Layout>
        <h1 className="title">SalesPage</h1>
        <JSONDisplay toast={toast} />
        <ToastContainer
                position="top-center"
                autoClose={3000}
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                style={{
                  left: '50%',
                  transform: 'translateX(calc(-50% + 110px))',
                }}
        />
      </Layout>
  );
}

export default SalesPage;
