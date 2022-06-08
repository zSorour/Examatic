import React, { useContext } from "react";
import AuthContext from "../../store/auth-context/authContext";
import { useRouter } from "next/router";

export default function StudentProfilePage() {
  const authCTX = useContext(AuthContext);
  const router = useRouter();

  const logout = () => {
    authCTX.logout();
    router.push("/login");
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
