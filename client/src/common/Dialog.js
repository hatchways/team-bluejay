import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
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
    <Dialog
      fullWidth
      maxWidth='md'
      open={isOpen}
      onClose={handleClose}
      aria-labelledby='max-width-dialog-title'>
        <DialogActions>
          <CloseIcon onClick={handleClose} color='primary'/>
        </DialogActions>
        <DialogTitle id='max-width-dialog-title'>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{subtitle}</DialogContentText>
          {children}
        </DialogContent> 
    </Dialog>
    
  )
}

export default CustomDialog;