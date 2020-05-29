import React from "react";
import { Grid, Paper, Avatar, Chip, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Image from "material-ui-image";
import ChefBanner from "components/ChefBanner";
import Navbar from "components/Navbar";
import MealItemList from "components/MealItemList";

const stub = {
  name: "Atsushi Mikazuki",
  location: "Toronto, Canada",
  bio:
    "Chef with 8 years of experience in Japanese cuisine. Recipient of awards and positive feedback.",
  avatarUrl:
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  meals: [
    {
      id: 1,
      name: "4 Specialty Rolls",
      price: 15,
      ingredients:
        "Rice, nori, avocado, cucumber, crab, wasabi, rice vinegar, soy sauce, salt sugar",
      requirements: "kitchen, cooking table",
      tagLine: "meal for 2",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "2 Yakisuba dishes, 6 sushi rolls, and 10 pc sashimi",
      price: 35,
      ingredients:
        "Rice, nori, avocado, cucumber, crab, wasabi, rice vinegar, soy sauce, salt sugar",
      requirements: "kitchen, cooking table",
      tagLine: "family style dinner for 4",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },
  ],
};

const ChefProfile = ({ user }) => {
  user = stub;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container>
        <ChefBanner chef={user} />
        <MealItemList chefName={user.name} meals={user.meals} />
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    flexGrow: 1,
  },
}));

export default ChefProfile;
