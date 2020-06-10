// Code Sample of How Dialog Context is Used:
/*
// ComponentWithButton.js
const { openDialog } = useContext(DialogContext);
<Button onClick={() => openDialog(<SampleForm />)} />;

// SampleForm.js
const { closeDialog } = useContext(DialogContext);
const onSubmitForm = (formData) => {
  // ...code to run on form submission
  closeDialog();
};
*/

//DialogContext

import React, { useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";

const DialogContext = React.createContext();

const DialogProvider = ({ children }) => {
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
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
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
        <DialogContent>{StuffInsideDialogue}</DialogContent>
      </Dialog>
      {children}
    </DialogContext.Provider>
  );
};

export { DialogProvider, DialogContext };
