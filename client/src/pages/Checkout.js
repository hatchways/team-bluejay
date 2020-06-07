import React, { useContext } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Select,
  Input,
  MenuItem,
  FormControl,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Button,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context as MealContext } from "contexts/MealContext";

const Checkout = () => {
  const classes = useStyles();
  const {
    state: { shoppingCart },
  } = useContext(MealContext);

  return <div>{shoppingCart.length}</div>;
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
}));

export default Checkout;
