import React, { useState, useContext } from "react";
import Dialog from "common/Dialog";
import EditProfileForm from "components/EditProfileForm";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit } from "@material-ui/icons";
import { Context as UserContext } from "contexts/AuthContext";
import { DialogContext } from "contexts/DialogContext";

const EditProfileButton = () => {
  const classes = useStyles();
  const { openDialog } = useContext(DialogContext);

  return (
    <>
      <Button
        variant="outlined"
        size="large"
        onClick={() => openDialog(<EditProfileForm />)}
      >
        <Edit />
        Edit
      </Button>
    </>
  );
};

const useStyles = makeStyles((theme) => ({}));

export default EditProfileButton;
