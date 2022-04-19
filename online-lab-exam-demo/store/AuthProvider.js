import AuthContext from "./authContext";

import { useState, useEffect } from "react";

let logoutTimer;

function AuthProvider({ children }) {
  const [username, setUsername] = useState("");
  const [id, setID] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  const [expirationDate, setExpirationDate] = useState();

  const authContext = {
    username: username,
    id: id,
    token: token,
    role: role,
    login: (id, username, role, token, existingExpiryDate) => {
      setID(id);
      setUsername(username);
      setRole(role);
      setToken(token);

      const currentDateTime = new Date().getTime();
      const expiryDate =
        existingExpiryDate || new Date(currentDateTime + 3000 * 60 * 60);
      setExpirationDate(expiryDate);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id,
          username,
          role,
          token,
          tokenExpiryDate: expiryDate.toISOString()
        })
      );
    },
    logout: () => {
      setUsername("");
      setID("");
      setToken("");
      setRole("");
      setExpirationDate(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user"));

    if (storedData && storedData.token) {
      const existingExpiryDate = new Date(storedData.tokenExpiryDate);
      const currentDate = new Date();
      if (existingExpiryDate > currentDate) {
        const { id, username, role, token } = storedData;
        authContext.login(id, username, role, token, existingExpiryDate);
      }
    }
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(authContext.logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, expirationDate]);

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}
export default AuthProvider;
