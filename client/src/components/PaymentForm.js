import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Context as UserContext } from "contexts/AuthContext";
import { Context as MealContext } from "contexts/MealContext";
import { Context as AlertContext } from "contexts/AlertContext";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import API from "api/index";

const PaymentForm = ({ shoppingCart, arrivalDate, chefId }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const {
    state: { user },
  } = useContext(UserContext);

  const { emptyCart } = useContext(MealContext);
  const { alert } = useContext(AlertContext);

  const history = useHistory();

  const classes = useStyles();

  useEffect(() => {
    const getClientSecret = async () => {
      const { data } = await API.post("/create-payment-intent", {
        orderedItems: shoppingCart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        // date convert to timestamp in ms
        arrivalDateTimeStamp: new Date(arrivalDate).getTime(),
        chefId: chefId,
        userId: user.id,
      });
      setClientSecret(data.clientSecret);
      console.log(data);
    };
    if (shoppingCart.length && arrivalDate) {
      getClientSecret();
    }
  }, [shoppingCart, arrivalDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.name,
        },
      },
    });
    console.log(payload);
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
      alert(payload.error.message);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      emptyCart();
      history.push("/");
      alert("Order Placed", "success");
    }
  };

  return arrivalDate && shoppingCart.length ? (
    <>
      <Box className={classes.paymentBox}>
        <Typography variant="h5" className={classes.paymentDetails}>
          Enter your payment details
        </Typography>
        <CardSection className={classes.paymentDetails} />
      </Box>
      <Button
        type="submit"
        size="large"
        variant="contained"
        color="primary"
        disabled={!stripe || !arrivalDate || !clientSecret}
        onClick={handleSubmit}
      >
        Confirm Checkout
      </Button>
    </>
  ) : (
    <Typography variant="h5" className={classes.message}>
      {shoppingCart.length
        ? "Choose an arrival date for your order"
        : "Your cart is empty"}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  paymentDetails: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  message: {
    color: theme.palette.error.main,
  },
  paymentBox: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "60%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    "& div:nth-child(3)": {
      [theme.breakpoints.up("md")]: {
        width: "50%",
      },
    },
    "& div:nth-child(4)": {
      [theme.breakpoints.up("md")]: {
        width: "50%",
      },
    },
    "& div:nth-child(1)": {
      margin: 0,
    },
    margin: theme.spacing(2, 0, 2, 0),
  },
  cardInput: {
    margin: theme.spacing(1, 0, 1, 0),
  },
}));

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "18px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#d8000c",
      iconColor: "#d8000c",
    },
  },
};

function CardSection() {
  return (
    <label>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  );
}

export default PaymentForm;
