import { useNavigate } from 'react-router-dom';

import Layout from '../../components/Layout/Layout';
import Login from '../../components/Login/Login';
import "./LoginPage.css";

import { useUser } from '../../contexts/UserContext';

const LoginPage = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleUserInfo = (response) => {
    localStorage.setItem("access_token", response.access_token);
    setUser(response.user);
    navigate("/");
  };

  return (
    <Layout>
      <div className="login-wrapper">
        <div className="login-card">
          <h1 className="login-title">Welcome to SalesAgent App</h1>
          <p className="login-subtitle">Sign in to continue</p>
          <div className="google-login-container">
            <Login onLoginSuccess={handleUserInfo} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
