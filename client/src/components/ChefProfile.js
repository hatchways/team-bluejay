import React from "react";
import { Grid, Paper, Avatar, Chip, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Image from "material-ui-image";
import ChefBanner from "components/ChefBanner";
import Navbar from "components/Navbar";
import MealItemList from "components/MealItemList";

const ChefProfile = ({ user }) => {
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
    margin: theme.spacing(10),
  },
}));

export default ChefProfile;
