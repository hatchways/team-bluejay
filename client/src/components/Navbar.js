import React, { useContext } from "react";
import TopNavigationBar from "components/TopNavigationBar";
import BottomNavigationBar from "components/BottomNavigationBar";
import { Hidden } from "@material-ui/core";
import { Context as AuthContext } from "contexts/AuthContext";

const Navbar = () => {
  // const {
  //   state: { user },
  // } = useContext(AuthContext);
  const user = {"name": "Sample", "isChef": true}
  return (
    <React.Fragment>
      <Hidden smDown>
        <TopNavigationBar loggedInUser={user} />
      </Hidden>
      <Hidden mdUp>
        <BottomNavigationBar loggedInUser={user} />
      </Hidden>
    </React.Fragment>
  );
};

export default Navbar;
