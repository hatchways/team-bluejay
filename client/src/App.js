import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "themes/theme";

import Navbar from "components/Navbar";
import ProtectedRoute from "common/ProtectedRoute";
import LoginPage from "pages/Login";
import SignUp from "pages/SignUp";
import Home from "pages/Home";
import Profile from "pages/Profile";

import { Provider as AuthProvider } from "contexts/AuthContext";
import { Provider as AlertContext } from "contexts/AlertContext";

import "App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <AlertContext>
          <AuthProvider>
            <Switch>
              <Route
                path="/login"
                render={(props) => <LoginPage {...props} />}
              />
              <Route path="/signup" render={(props) => <SignUp {...props} />} />
              <ProtectedRoute
                path="/"
                render={(props) => <LoggedInContainer {...props} />}
              />
            </Switch>
          </AuthProvider>
        </AlertContext>
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
