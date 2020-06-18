import React, { useContext } from "react";
import TopNavigationBar from "components/TopNavigationBar";
import BottomNavigationBar from "components/BottomNavigationBar";
import { Hidden } from "@material-ui/core";
import { Context as AuthContext } from "contexts/AuthContext";

const Navbar = () => {
  const {
    state: { user },
    signOut,
  } = useContext(AuthContext);
  return (
    <>
      <Hidden smDown>
        <TopNavigationBar loggedInUser={user} signOut={signOut} />
      </Hidden>
      <Hidden mdUp>
        <BottomNavigationBar loggedInUser={user} signOut={signOut} />
      </Hidden>
    </>
  );
};

export default Navbar;
