import React, { useState, useContext, useEffect } from "react";
import Dialog from "common/Dialog";
import Form from "common/Form";
import { Button, Typography, Box } from "@material-ui/core";
import { Context as UserContext } from "contexts/AuthContext";
import API from "api";
import { makeStyles } from "@material-ui/core/styles";
import { Clear } from "@material-ui/icons";

const BecomeChefButton = ({ loggedInUser }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const { createMeal, updateUser } = useContext(UserContext);

  const classes = useStyles();

  useEffect(() => {
    (async function getCuisines() {
      const { data: allCuisines } = await API.get("/cuisines");
      setCuisines(allCuisines);
    })();
  }, []);

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

  const handleSubmit = ({ ...mealObject }) => {
    createMeal(mealObject);
    updateUser({ isChef: true, chefCuisine: selectedCuisine });
    setDialogOpen(false);
  };

  return (
    !loggedInUser.isChef && (
      <>
        <Button size="large" onClick={() => setDialogOpen(true)}>
          Become A Chef
        </Button>

        <Dialog isOpen={dialogOpen} handleClose={() => setDialogOpen(false)}>
          <Typography
            variant="h5"
            component="h3"
            display="block"
            align="center"
          >
            Select a Cuisine for your Chef Profile
          </Typography>
          <Box display="inline" wrap="flex-wrap">
            {cuisines.map((c) => (
              <Button
                color={c.name === selectedCuisine ? "primary" : "default"}
                variant="contained"
                className={classes.cuisineButton}
                onClick={() => setSelectedCuisine(c.name)}
              >
                {c.name}
              </Button>
            ))}
          </Box>

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

const useStyles = makeStyles((theme) => ({
  cuisineButton: {
    margin: theme.spacing(1),
  },
}));

export default BecomeChefButton;
