import React, { useContext } from "react";

import styles from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import AuthContext from "../../../store/auth-context/authContext";

const NavigationItems = () => {
  const authCTX = useContext(AuthContext);

  let navigationItems;

  if (authCTX.role === "Student") {
    navigationItems = (
      <ul className={styles.NavigationItems}>
        <NavigationItem link="/students" exact>
          Dashboard
        </NavigationItem>
        <NavigationItem link="/students/exams" exact>
          Exams
        </NavigationItem>
        <div onClick={authCTX.logout}>
          <NavigationItem link="/login">Logout</NavigationItem>
        </div>
      </ul>
    );
  } else if (authCTX.role === "Instructor") {
    navigationItems = (
      <ul className={styles.NavigationItems}>
        <NavigationItem link="/instructors" exact>
          Dashboard
        </NavigationItem>
        <NavigationItem link="/instructors/exams" exact>
          Exams
        </NavigationItem>
        <div onClick={authCTX.logout}>
          <NavigationItem link="/login">Logout</NavigationItem>
        </div>
      </ul>
    );
  } else {
    navigationItems = (
      <ul className={styles.NavigationItems}>
        <NavigationItem link="/login" exact>
          Login
        </NavigationItem>
      </ul>
    );
  }

  return navigationItems;
};

export default NavigationItems;
