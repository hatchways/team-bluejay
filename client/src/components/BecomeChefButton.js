import React, { useState, useContext } from "react";
import Dialog from "common/Dialog";
import Form from "common/Form";
import { Button } from "@material-ui/core";
import { Context as MealContext } from "contexts/MealContext";
import { Context as UserContext } from "contexts/AuthContext";

const BecomeChefButton = ({ loggedInUser }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { createMeal } = useContext(MealContext);
  const { refreshLoggedInUser } = useContext(UserContext);
  const isChef = loggedInUser.isChef || false;
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

  const handleSubmit = ({ ...mealObject }) => {
    createMeal(mealObject);
    refreshLoggedInUser();
    setDialogOpen(false);
  };

  return (
    !isChef && (
      <>
        <Button size="large" onClick={() => setDialogOpen(true)}>
          Become A Chef
        </Button>

        <Dialog isOpen={dialogOpen} handleClose={() => setDialogOpen(false)}>
          <Form
            header="Add your first meal to become a chef"
            onSubmit={handleSubmit}
            fields={fields}
            submitButtonLabel="Submit"
          />
        </Dialog>
      </>
    )
  );
};

export default BecomeChefButton;
