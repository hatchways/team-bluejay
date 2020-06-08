// How Dialog Context is Used:

// Profile.js
const { openDialog } = useContext(dialogContext);
<Button onClick={() => openDialog(<EditProfileForm />)} />;

//EditProfileForm.js
const { closeDialog } = useContext(dialogContext);
const onSubmitForm = (formData) => {
  // ...code to run on form submission
  closeDialog();
};

//DialogContext

import React, { useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";

const Context = React.createContext();

const Provider = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [StuffInsideDialogue, setStuffInsideDialog] = useState(null);

  function openDialog(componentWithin) {
    setStuffInsideDialog(componentWithin);
    setDialogOpen(true);
  }

  function closeDialog() {
    setStuffInsideDialog(null);
    setDialogOpen(false);
  }

  return (
    <Context.Provider value={{ openDialog, closeDialog }}>
      <Dialog
        fullWidth
        maxWidth="md"
        open={dialogOpen}
        aria-labelledby="max-width-dialog-title"
        color="primary"
      >
        <DialogActions>
          <CloseIcon onClick={closeDialog} color="primary" />
        </DialogActions>
        <DialogContent>
          {/* Problem:  Throws error that useEffect and useState hooks from StuffInsideDialogue must be called on top level of component*/}
          {StuffInsideDialogue && <StuffInsideDialogue />}
        </DialogContent>
      </Dialog>
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
