import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'

const CustomDialog = ({
  isOpen,
  handleClose,
  title,
  subtitle,
  children
}) => {
  return (
    <>
      <Dialog
        fullWidth
        maxWidth='md'
        open={isOpen}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'>
          <DialogTitle id='max-width-dialog-title'>
            {title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{subtitle}</DialogContentText>
            {children}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              Close
            </Button>
          </DialogActions>
      </Dialog>
    </>
  )
}

export default CustomDialog;