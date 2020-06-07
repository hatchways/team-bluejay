import React, { useState, useContext } from "react";
import { Button, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context as MealContext } from "contexts/MealContext";
import { ShoppingCartOutlined, ShoppingCart } from "@material-ui/icons";

const ShoppingCartIcon = () => {
  const {
    state: { shoppingCart },
  } = useContext(MealContext);
  const classes = useStyles();

  const Icon = shoppingCart ? (
    // reduce to accumulate quantity from shopping cart
    <Badge
      badgeContent={shoppingCart.reduce((acc, item) => acc + item.quantity, 0)}
      color="primary"
    >
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
