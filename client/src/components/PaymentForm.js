import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, Box, Button } from "@material-ui/core";
import {
  useStripe,
  useElements,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";

import API from "api/index";

const PaymentForm = ({ shoppingCart, arrivalDate }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const classes = useStyles();

  useEffect(() => {
    const getClientSecret = async () => {
      const { data } = await API.post("/create-payment-intent", {
        orderedItems: shoppingCart,
        arrivalDate: arrivalDate,
      });
      setClientSecret(clientSecret);
      console.log(data);
    };

    getClientSecret();
  }, [shoppingCart, arrivalDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Gariel",
        },
      },
    });
    console.log(payload);
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <>
      <Box className={classes.paymentBox}>
        <CardSection />
      </Box>
      <Button
        type="submit"
        size="large"
        variant="contained"
        color="primary"
        disabled={!stripe || !arrivalDate}
        onClick={handleSubmit}
      >
        Checkout
      </Button>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
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
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
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
