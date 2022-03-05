import AuthContext from "./authContext";

import { useState } from "react";

function AuthProvider({ children }) {
  const [username, setUsername] = useState("");
  const [id, setID] = useState("");
  const [token, setToken] = useState("");

  const authContext = {
    username: username,
    id: id,
    token: token,
    login: (id, username, token) => {
      setID(id);
      setUsername(username);
      setToken(token);
    },
    logout: () => {
      setUsername("");
      setID("");
      setToken("");
    }
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}
export default AuthProvider;
