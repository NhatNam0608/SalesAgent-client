import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GGMap from '../../components/Map/Map';
import Layout from '../../components/Layout/Layout';
import './MapPage.css';
const MapPage = () => (
  <Layout>
    <h1 className="title">Map</h1>
    <GGMap toast={toast} />
    <ToastContainer
            position="top-center"
            autoClose={3000}
            pauseOnHover={false}
            pauseOnFocusLoss={false}
            />
  </Layout>
);

export default MapPage;
