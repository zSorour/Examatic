import { createContext } from "react";

//We actually fill the auth context with dummy data even for the functions only for better code completion and intellisense, etc.
const AuthContext = createContext({
  username: "",
  id: "",
  token: "",
  login: (id, username, role, token) => {},
  logout: () => {}
});

export default AuthContext;
