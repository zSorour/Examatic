import React from "react";

import classes from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const NavigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/" exact>
      Dashboard
    </NavigationItem>
    <NavigationItem link="/exams" exact>
      Exams
    </NavigationItem>

    {!props.isAuthenticated ? (
      <NavigationItem link="/login">Sign In</NavigationItem>
    ) : (
      <NavigationItem link={`/profile`}>Profile</NavigationItem>
    )}
  </ul>
);

export default NavigationItems;
