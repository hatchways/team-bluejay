import React, { useState, useContext } from "react";
import { Button, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context as UserContext } from "contexts/AuthContext";
import { Context as MealContext } from "contexts/MealContext";
import { ShoppingCartOutlined, ShoppingCart } from "@material-ui/icons";

const ShoppingCartIcon = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { createMeal } = useContext(UserContext);
  const {
    state: { shoppingCart },
    addItem,
  } = useContext(MealContext);
  const classes = useStyles();

  const handleClick = ({ ...mealObject }) => {
    createMeal(mealObject);
    setDialogOpen(false);
  };

  const Icon = shoppingCart.length ? (
    <Badge badgeContent={4} color="primary">
      <ShoppingCartOutlined />
    </Badge>
  ) : (
    <ShoppingCart color="secondary" />
  );

  return <Button className={classes.shoppingCart}>{Icon}</Button>;
};

const useStyles = makeStyles((theme) => ({
  shoppingCart: {
    "& svg": {
      fontSize: "2rem",
    },
  },
}));

export default ShoppingCartIcon;
