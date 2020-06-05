import React, { useState, useContext } from "react";
import Dialog from "common/Dialog";
import EditProfileForm from "components/EditProfileForm";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit } from "@material-ui/icons";
import { Context as UserContext } from "contexts/AuthContext";

const EditMealButton = () => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (profileData) => {
    // todo
  };

  return (
    <>
      <Button
        className={classes.editMealButton}
        variant="outlined"
        size="small"
        onClick={() => setDialogOpen(true)}
      >
        <Edit />
        Edit
      </Button>

      <Dialog isOpen={dialogOpen} handleClose={() => setDialogOpen(false)}>
        {/* // todo */}
      </Dialog>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  editMealButton: {
    width: "fit-content",
    position: "absolute",
    right: "5%",
  },
}));

export default EditMealButton;
