import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import RootProvider from "contexts/RootProvider";

import Navbar from "components/Navbar";
import ProtectedRoute from "common/ProtectedRoute";
import LoginPage from "pages/Login";
import SignUp from "pages/SignUp";
import Home from "pages/Home";
import Profile from "pages/Profile";
import Chefs from "pages/Chefs";
import ChefProfile from "components/ChefProfile";

import "App.css";

function App() {
  return (
    <BrowserRouter>
      <RootProvider>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUp} />
          <ProtectedRoute path="/" component={LoggedInContainer} />
        </Switch>
      </RootProvider>
    </BrowserRouter>
  );
}

const LoggedInContainer = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route path="/chefs/:chefId" component={ChefProfile} />
        <Route path="/chefs" component={Chefs} />
        <Route path="/profile" component={Profile} />
        <Route path="/" component={Chefs} />
      </Switch>
    </React.Fragment>
  );
};

export default App;
