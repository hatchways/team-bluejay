import React, { useContext, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";

import PaymentForm from "components/PaymentForm";
import { makeStyles } from "@material-ui/core/styles";
import { Context as MealContext } from "contexts/MealContext";
import { Context as AuthContext } from "contexts/AuthContext";
import API from "api/index";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import foodImg from "images/makisushi.jpg";
import { DialogContext } from "contexts/DialogContext";

const Checkout = () => {
  const classes = useStyles();
  const {
    state: { shoppingCart, chefId },
  } = useContext(MealContext);
  const {
    state: { user },
  } = useContext(AuthContext);
  const { openDialog, closeDialog } = useContext(DialogContext);

  const [selectedDate, handleDateChange] = useState(null);

  const totalPrice = shoppingCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const getClientSecret = async () => {
    const { data } = await API.post("/create-payment-intent", {
      orderedItems: shoppingCart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      // datetime convert to timestamp in ms
      arrivalDateTimeStamp: new Date(selectedDate).getTime(),
      chefId: chefId,
      userId: user.id,
    });
    return data;
  };

  const openPaymentDialog = async () => {
    const { clientSecret, orderId } = await getClientSecret();
    openDialog(
      <PaymentForm
        clientSecret={clientSecret}
        user={user}
        orderId={orderId}
        closeDialog={closeDialog}
      />
    );
  };

  const formattedPrice = (Math.round(totalPrice * 100) / 100).toFixed(2);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={classes.root}>
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Paper className={classes.checkoutPaper} elevation={2}>
              <Box className={classes.yourOrdersHeader}>
                <Typography variant="h5" align="center">
                  Your Order
                </Typography>
              </Box>
              <Box>
                {shoppingCart.map((item) => (
                  <OrderCard key={item.id} mealItem={item} chefId={chefId} />
                ))}
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4" display="inline-flex">
                  Total :
                </Typography>
                <Typography variant="h4" display="inline-flex">
                  {`$ ${formattedPrice}`}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <Paper className={classes.checkoutPaper} elevation={0}>
              <Box className={classes.checkoutBox}>
                <Typography variant="h4" component="h1">
                  Checkout
                </Typography>
              </Box>
              <hr />
              <Box className={classes.checkoutBox}>
                <Typography variant="h5" className={classes.arrivalTime}>
                  Arrival Time:
                </Typography>
                <DateTimePicker
                  clearable
                  variant="inline"
                  minutesStep={30}
                  place
                  value={selectedDate}
                  onChange={handleDateChange}
                  onError={console.log}
                  disablePast
                  minDate={Date.now()}
                  format="MM/dd/yyyy HH:mm a"
                  className={classes.arrivalTime}
                  helperText={selectedDate ? "" : "Please choose a Date & Time"}
                />
              </Box>
              <Box className={classes.checkoutBox}>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={!selectedDate || !shoppingCart.length}
                  onClick={openPaymentDialog}
                >
                  Confirm Order
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </MuiPickersUtilsProvider>
  );
};

const OrderCard = ({ mealItem, chefId }) => {
  const { checkCartStatus, removeFromCart } = useContext(MealContext);

  const classes = useStyles();
  const { name, id, quantity, price } = mealItem;

  const handleAdd = () => {
    checkCartStatus(mealItem, chefId);
  };

  const handleRemove = () => {
    removeFromCart(mealItem);
  };
  return (
    <Card className={classes.mealItemCard} key={id}>
      <CardMedia className={classes.mealItemPic} image={foodImg} title={name} />
      <CardContent className={classes.cardContent}>
        <Typography variant="body1">{name}</Typography>
        <Typography variant="h6">{`$${price} x ${quantity}`}</Typography>
        <AddCircle onClick={handleAdd} />
        <RemoveCircle onClick={handleRemove} />
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  arrivalTime: {
    margin: theme.spacing(0, 3, 0, 0),
    display: "inline-block",
  },
  cardContent: {
    color: theme.palette.secondary.main,
    "& p": {
      marginBottom: theme.spacing(1),
    },
    "& svg": {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    "& svg:nth-of-type(1)": {
      color: theme.palette.primary.main,
    },
  },
  mealItemPic: {
    minHeight: "100px",
    minWidth: "100px",
    maxWidth: "40%",
  },
  mealItemCard: {
    padding: theme.spacing(2),
    display: "flex",
  },
  yourOrdersHeader: {
    padding: theme.spacing(3),
    fontWeight: "bold",
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
  checkoutBox: {
    padding: theme.spacing(3, 6, 3, 6),
  },
  checkoutPaper: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    margin: theme.spacing(0, 2, 0, 2),
    "& hr": {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    "& h4": {
      margin: theme.spacing(3, 2, 3, 2),
    },
    "& h4:nth-of-type(2)": {
      color: theme.palette.primary.main,
      fontWeight: "bold",
    },
  },
  container: {
    flexDirection: "row-reverse",
  },
  root: {
    marginTop: theme.spacing(1),
  },
}));

export default Checkout;
