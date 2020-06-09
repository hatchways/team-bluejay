import React, { useState, useContext } from "react";
import Dialog from "common/Dialog";
import Form from "common/Form";
import { Button } from "@material-ui/core";
import { Context as UserContext } from "contexts/AuthContext";
import { DialogContext } from "contexts/DialogContext";

const BecomeChefButton = ({ loggedInUser }) => {
  const { openDialog, closeDialog } = useContext(DialogContext);
  const { createMeal } = useContext(UserContext);

  const fields = [
    {
      name: "name",
      label: "Meal Name",
      validation: {
        required: "Meal Name is required.",
      },
    },
    {
      name: "price",
      label: "Price",
      validation: {
        required: "Price is required.",
        pattern: {
          value: /\d+/,
          message: "Please supply a proper price",
        },
      },
    },
    {
      name: "servings",
      label: "Servings",
      validation: {
        required: "Servings is required.",
        pattern: {
          value: /^\d+$/,
          message: "Please supply a proper serving size",
        },
      },
    },
    {
      name: "description",
      label: "Description",
    },
    {
      name: "ingredients",
      label: "Ingredients",
    },
    {
      name: "required_items",
      label: "Required Items",
    },
  ];

  const handleSubmit = (mealObject) => {
    createMeal(mealObject);
    closeDialog();
  };

  return (
    !loggedInUser.isChef && (
      <>
        <Button
          size="large"
          onClick={() =>
            openDialog(
              <Form
                header="Add your first meal to become a chef"
                onSubmit={handleSubmit}
                fields={fields}
                submitButtonLabel="Submit"
              />
            )
          }
        >
          Become A Chef
        </Button>
      </>
    )
  );
};

export default BecomeChefButton;
