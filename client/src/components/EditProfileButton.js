import React, { useState, useContext } from "react";
import Dialog from "common/Dialog";
import EditProfileForm from "components/EditProfileForm";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit } from "@material-ui/icons";
import { Context as UserContext } from "contexts/AuthContext";

const EditProfileButton = () => {
  const classes = useStyles();
  const { updateUser } = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (profileData) => {
    updateUser(profileData);
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        size="large"
        onClick={() => setDialogOpen(true)}
      >
        <Edit />
        Edit
      </Button>

      <Dialog isOpen={dialogOpen} handleClose={() => setDialogOpen(false)}>
        <EditProfileForm onSubmit={handleSubmit} />
      </Dialog>
    </>
  );
};

const useStyles = makeStyles((theme) => ({}));

export default EditProfileButton;
