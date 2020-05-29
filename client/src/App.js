import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "themes/theme";

import Bootstrapper from "components/Bootstrapper";
import Navbar from "components/Navbar";
import ProtectedRoute from "common/ProtectedRoute";
import LoginPage from "pages/Login";
import SignUp from "pages/SignUp";
import Home from "pages/Home";
import Profile from "pages/Profile";

import { Provider as AuthProvider } from "contexts/AuthContext";
import { Provider as MealProvider } from "contexts/MealContext";
import { Provider as AlertProvider } from "contexts/AlertContext";

import "App.css";
import ChefProfile from "components/ChefProfile";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <AlertProvider>
          <AuthProvider>
            <Bootstrapper>
              <MealProvider>
                <Switch>
                  <Route path="/login" component={LoginPage} />
                  <Route path="/signup" component={SignUp} />
                  <ProtectedRoute path="/" component={LoggedInContainer} />
                </Switch>
              </MealProvider>
            </Bootstrapper>
          </AuthProvider>
        </AlertProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

const LoggedInContainer = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route path="/Profile" render={(props) => <Profile {...props} />} />
        <Route path="/" render={(props) => <Home {...props} />} />
      </Switch>
    </React.Fragment>
  );
};

export default App;
