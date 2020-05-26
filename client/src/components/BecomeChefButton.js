import React, {useState, useContext} from "react";
import Dialog from "common/Dialog"
import Form from "common/Form";
import {
  Button
} from "@material-ui/core";

// import { Context as AuthContext } from "contexts/AuthContext";

const BecomeChefButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
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

  return (
    <>
      <Button 
        size="large"
        onClick={() => setDialogOpen(true)}
      >
        Become A Chef
      </Button>
      
      <Dialog
          isOpen={dialogOpen}
          handleClose={() => setDialogOpen(false)}
      >
        <Form
          header="Add your first meal to become a chef"
          // onSubmit={handleSubmit}
          fields={fields}
          submitButtonLabel="Create Meal / Become A Chef"
        />
      </Dialog>
    </>
  );
}

export default BecomeChefButton;