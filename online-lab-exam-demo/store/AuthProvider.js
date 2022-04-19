import AuthContext from "./authContext";

import { useState } from "react";

function AuthProvider({ children }) {
  const [username, setUsername] = useState("");
  const [id, setID] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  const authContext = {
    username: username,
    id: id,
    token: token,
    login: (id, username, role, token) => {
      setID(id);
      setUsername(username);
      setRole(role);
      setToken(token);
    },
    logout: () => {
      setUsername("");
      setID("");
      setToken("");
      setRole("");
    }
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}
export default AuthProvider;
