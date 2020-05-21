import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "themes/theme";
import LoginPage from "pages/Login";
import SignUp from "pages/SignUp";

import "App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUp} />
          <Route path="/" component={SignUp} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
