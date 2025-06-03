import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import Avatar from "../../components/Avatar/Avatar";
import Layout from '../../components/Layout/Layout';
import './AccountPage.css';

import { useUser } from '../../contexts/UserContext';

const AccountPage = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return <p>Loading...</p>; // hoặc redirect tới login
  }

  return (
    <Layout>
        <div className="account-container">
            <div className="account-card">
                <Avatar src={user.picture} alt={user.name} className="avatar-img" />
                <h2>{user.name}</h2>
                <p>{user.email}</p>

                <button className="logout-btn" onClick={handleLogout}>Log out</button>
            </div>
        </div>
    </Layout>
  );
};

export default AccountPage;
