import React from "react";

import classes from "./Toolbar.module.css";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

const Toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={classes.Logo}>
        <h1>Examatic</h1>
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems />
      </nav>
    </header>
  );
};

export default Toolbar;
