import { Link, useLocation } from 'react-router-dom';
import './Layout.css';
import Avatar from "../Avatar/Avatar";

import { useUser } from '../../contexts/UserContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useUser();

  const isLoggedIn = !!user;

  return (
    <div className="container">
      <div className="sidebar">
        <div className={`top-bar ${location.pathname === '/account' ? 'active' : ''}`}>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link btn-login">Log in</Link>
              <Link to="/signup" className="nav-link btn-signup">Sign up</Link>
            </>
          ) : (
            <Link to="/account" className="avatar-link">
              <Avatar src={user.picture} alt={user.name} className="avatar-img" />
            </Link>
          )}
        </div>

        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>🏠 Home</Link>
        <Link to="/privacy-policy" className={`nav-link ${location.pathname === '/privacy-policy' ? 'active' : ''}`}>🔒 Privacy Policy</Link>
        <Link to="/map" className={`nav-link ${location.pathname === '/map' ? 'active' : ''}`}>🗺️ Map</Link>
        <Link to="/sales" className={`nav-link ${location.pathname === '/sales' ? 'active' : ''}`}>💰 Sales</Link>
      </div>

      <div className="main">
        {children}
      </div>
    </div>
  );
};

export default Layout;
