import React, { useContext } from "react";
import { useRouter } from "next/router";

import AuthContext from "../store/auth-context/authContext";
import LoginForm from "../components/LoginForm/LoginForm";

const LoginPage = () => {
  const router = useRouter();
  const authCTX = useContext(AuthContext);

  if (authCTX.role === "Student") {
    router.push("/students");
  } else if (authCTX.role === "Instructor") {
    router.push("/instructors");
  }

  return <LoginForm />;
};

export default LoginPage;
