import React, { useContext } from "react";
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
import { Add } from "@material-ui/icons";
import CreateMealForm from "components/CreateMealForm";
import { DialogContext } from "contexts/DialogContext";

const MealItemList = ({ chef, meals, editable }) => {
  const classes = useStyles();
  const { openDialog } = useContext(DialogContext);

  return (
    <Grid item className={classes.root}>
      <Typography
        variant="h5"
        className={classes.menuTitle}
      >{`${chef.name}'s Menu`}</Typography>
      {editable && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.addMeal}
          onClick={() => openDialog(<CreateMealForm />)}
        >
          <Add />
          Add a meal
        </Button>
      )}

      <Grid item className={classes.menuList}>
        {/* Todo: Add ability for chef to edit order of their meal items */}
        {/* Todo: Prevent editing of menu items from changing order of meal items returned by backend */}
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
  addMeal: {
    marginBottom: theme.spacing(3),
  },
}));

export default MealItemList;
