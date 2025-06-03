import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const access_token = googleUser.getAuthResponse().access_token;
      const profile = googleUser.getBasicProfile();
      onLoginSuccess?.({
        access_token,
        user: {
          name: profile.getName(),
          email: profile.getEmail(),
          picture: profile.getImageUrl(),
        },
      });
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <div className="google-login-wrapper">
      <button className="google-login-button" onClick={handleLogin}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          className="google-logo"
        />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default Login;
