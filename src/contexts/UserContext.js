import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
  
    if (storedUser) {
      const user = JSON.parse(storedUser);
  
      fetch(`${process.env.REACT_APP_API_BASE}/verify-token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
      })
      .then(res => {
        if (res.ok) {
          setUser(user);
        } else {
          // Token không hợp lệ
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        setUser(null);
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
