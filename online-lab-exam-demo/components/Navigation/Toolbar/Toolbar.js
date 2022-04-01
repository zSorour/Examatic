import React, { useContext } from "react";

import classes from "./Toolbar.module.css";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";
import AuthContext from "../../../store/authContext";

const Toolbar = (props) => {
  const authCTX = useContext(AuthContext);

  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={classes.Logo}>
        <h1>GP Demo</h1>
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems
          isAuthenticated={!!authCTX.token}
          username={authCTX.username}
        />
      </nav>
    </header>
  );
};

export default Toolbar;
