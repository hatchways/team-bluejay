import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  Chip,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Image from "material-ui-image";
import MealItem from "components/MealItem";

const MealItemList = ({ chef, meals, editable }) => {
  const classes = useStyles();
  return (
    <Grid item className={classes.root}>
      <Typography
        variant="h5"
        className={classes.menuTitle}
      >{`${chef.name}'s Menu`}</Typography>
      <Grid item className={classes.menuList}>
        {meals &&
          meals.map((meal) => {
            return (
              <MealItem
                key={meal.id}
                meal={meal}
                editable={editable}
                chefId={chef.id}
              />
            );
          })}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    backgroundColor: "#f8f8ff",
    alignItems: "center",
    flexDirection: "column",
  },
  menuTitle: {
    margin: theme.spacing(5),
  },
  menuList: {
    width: "100%",
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexDirection: "column",
  },
}));

export default MealItemList;
