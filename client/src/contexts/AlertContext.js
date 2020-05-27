import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const Context = React.createContext();

const Provider = ({ children }) => {
  const [severity, setSeverity] = useState("error");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const alert = (message, severity = "error") => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  return (
    <Context.Provider value={{ alert }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
    </Context.Provider>
  );
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export { Provider, Context };
