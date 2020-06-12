import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import RootProvider from "contexts/RootProvider";

import Navbar from "components/Navbar";
import ProtectedRoute from "common/ProtectedRoute";
import LoginPage from "pages/Login";
import SignUp from "pages/SignUp";
import Checkout from "pages/Checkout";
import Profile from "pages/Profile";
import Chefs from "pages/Chefs";
import Orders from "pages/Orders";
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
    <>
      <Navbar />
      <Switch>
        <Route
          path="/chefs/:chefId"
          render={(props) => <ChefProfile {...props} />}
        />
        <Route path="/checkout" component={Checkout} />
        <Route path="/chefs" component={Chefs} />
        <Route path="/profile/orders" component={Orders} />
        <Route path="/profile" component={Profile} />
        <Route path="/" component={Chefs} />
      </Switch>
    </>
  );
};

export default App;
