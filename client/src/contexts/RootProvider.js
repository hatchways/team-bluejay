import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "themes/theme";

import { Provider as AuthProvider } from "contexts/AuthContext";
import { Provider as MealProvider } from "contexts/MealContext";
import { Provider as AlertProvider } from "contexts/AlertContext";
import { DialogProvider } from "contexts/DialogContext";

const RootProvider = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <AlertProvider>
        <AuthProvider>
          <MealProvider>
            <DialogProvider>{children}</DialogProvider>
          </MealProvider>
        </AuthProvider>
      </AlertProvider>
    </MuiThemeProvider>
  );
};

export default RootProvider;
