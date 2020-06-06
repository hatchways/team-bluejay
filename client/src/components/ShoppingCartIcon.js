import React, { useState, useContext } from "react";
import { Button, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context as MealContext } from "contexts/MealContext";
import { ShoppingCartOutlined, ShoppingCart } from "@material-ui/icons";

const ShoppingCartIcon = () => {
  const { shoppingCart } = useContext(MealContext);
  const classes = useStyles();

  const Icon = shoppingCart.length ? (
    <Badge badgeContent={shoppingCart.length} color="primary">
      <ShoppingCart />
    </Badge>
  ) : (
    <ShoppingCartOutlined color="secondary" />
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
