import React, {useState, useContext} from "react";
import Dialog from "common/Dialog"
import Form from "common/Form";
import {
  Button
} from "@material-ui/core";

// import { Context as AuthContext } from "contexts/AuthContext";

const BecomeChefButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const text="Become A Chef";
  // const { login } = useContext(AuthContext);
  const fields = [
    {
      name: "mealName",
      label: "Meal Name",
      validation: {
        required: "Name is required.",
      },
    },
    {
      name: "description",
      label: "Description",
    },
  ];

  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  }

  return (
    <Button 
      size="large"
      onClick={toggleDialog}
    >
      {text}
      <Dialog
          isOpen={dialogOpen}
          handleClose={toggleDialog}
      >
        <Form
          header="Add your first meal to become a chef"
          // onSubmit={}
          fields={fields}
          submitButtonLabel="Create Meal / Become A Chef"
        />
      </Dialog>
    </Button>
  );
}

export default BecomeChefButton;