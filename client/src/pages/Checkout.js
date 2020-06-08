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
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import PaymentForm from "components/PaymentForm";
import { makeStyles } from "@material-ui/core/styles";
import { Context as MealContext } from "contexts/MealContext";
import foodImg from "images/makisushi.jpg";

const Checkout = () => {
  const classes = useStyles();
  const {
    state: { shoppingCart, chefId },
  } = useContext(MealContext);

  const totalPrice = shoppingCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Paper className={classes.checkoutPaper} elevation={0}>
            <Box className={classes.checkoutBox}>
              <Typography variant="h4" component="h1">
                Checkout
              </Typography>
            </Box>
            <hr />
            <Box className={classes.checkoutBox}>
              <Typography variant="h6" component="h3">
                Enter your payment details
              </Typography>
              <PaymentForm />
            </Box>
          </Paper>
        </Grid>
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
                {`$ ${totalPrice}`}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
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
    <Card className={classes.mealItemCard}>
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
  root: {
    marginTop: theme.spacing(1),
  },
}));

export default Checkout;
