import React, { useContext } from "react";

import NavigationItems from "../NavigationItems/NavigationItems";
import classes from "./SideDrawer.module.css";
import Backdrop from "../../UI/Backdrop/Backdrop";
import AuthContext from "../../../store/authContext";

const SideDrawer = (props) => {
  const authCTX = useContext(AuthContext);

  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <React.Fragment>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(" ")} onClick={props.closed}>
        <div className={classes.Logo}>
          <h1>GP Demo</h1>
        </div>
        <nav>
          <NavigationItems isAuthenticated={!!authCTX.token} />
        </nav>
      </div>
    </React.Fragment>
  );
};

export default SideDrawer;
