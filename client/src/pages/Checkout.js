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
import PaymentForm from "components/PaymentForm";
import { makeStyles } from "@material-ui/core/styles";
import { Context as MealContext } from "contexts/MealContext";

const Checkout = () => {
  const classes = useStyles();
  const {
    state: { shoppingCart },
  } = useContext(MealContext);

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} sm={12} md={8} lg={9}>
          <Paper className={classes.checkoutPaper} elevation={0}>
            <Box className={classes.checkoutBox}>
              <Typography variant="h4" component="h1">
                Checkout
              </Typography>
            </Box>
            <hr
              style={{
                borderWidth: "0.25px",
                color: "red",
                backgroundColor: "red",
              }}
            />
            <Box className={classes.checkoutBox}>
              <Typography variant="h6" component="h3">
                Enter your payment details
              </Typography>
              <PaymentForm />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3}>
          <Paper className={classes.checkoutPaper} elevation={2}>
            <Box>
              <Typography variant="h6" align="center">
                Your Order
              </Typography>
            </Box>
            <Box>
              {shoppingCart.map((item) => (
                <Card>{item.name + ": " + item.quantity}</Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  checkoutBox: {
    padding: theme.spacing(3, 6, 3, 6),
  },
  checkoutPaper: { margin: theme.spacing(0, 2, 0, 2) },
  root: {
    marginTop: theme.spacing(1),
  },
}));

export default Checkout;
