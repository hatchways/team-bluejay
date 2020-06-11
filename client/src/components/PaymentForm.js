import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { Context as MealContext } from "contexts/MealContext";
import { Context as AlertContext } from "contexts/AlertContext";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import API from "api/index";

const PaymentForm = ({ clientSecret, orderId, user, closeDialog }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const { emptyCart } = useContext(MealContext);
  const { alert } = useContext(AlertContext);

  const history = useHistory();

  const classes = useStyles();

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
      // update order status to "fulfilled" in the backend
      API.put(`/orders/${orderId}`, {
        clientSecret,
      });
    }
    closeDialog();
  };

  return (
    <>
      <Box className={classes.paymentBox}>
        <Typography variant="h5" className={classes.paymentDetails}>
          Enter your payment details
        </Typography>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </Box>
      <Button
        type="submit"
        size="large"
        variant="contained"
        color="primary"
        disabled={!stripe || !clientSecret}
        onClick={handleSubmit}
        className={classes.paymentDetails}
      >
        Checkout
      </Button>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paymentDetails: {
    margin: theme.spacing(4, 0, 4, 0),
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

export default PaymentForm;
