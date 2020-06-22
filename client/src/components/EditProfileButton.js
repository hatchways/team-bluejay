import React, { useContext } from "react";
import EditProfileForm from "components/EditProfileForm";
import { Button } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { DialogContext } from "contexts/DialogContext";

const EditProfileButton = () => {
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

export default EditProfileButton;
