import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Context as AuthContext } from "contexts/AuthContext";
import API from "api/index";
import { format } from "date-fns";
import { ExpandMore } from "@material-ui/icons";
import {
  Tab,
  Tabs,
  AppBar,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";

const Orders = () => {
  const {
    state: { user },
  } = useContext(AuthContext);

  const [userOrders, setUserOrders] = useState([]);
  const [chefOrders, setChefOrders] = useState([]);
  const [ordersView, setOrdersView] = useState(true);

  const classes = useStyles();

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const {
      data: { userOrders, chefOrders },
    } = await API.get("/orders");
    setUserOrders(userOrders);
    setChefOrders(chefOrders);
    return;
  };

  const toggleView = () => {
    setOrdersView(!ordersView);
  };

  const ordersToShow = ordersView ? userOrders : chefOrders;

  const sortedOrders = ordersToShow.sort(
    (a, b) => new Date(a.arrival_date_time) - new Date(b.arrival_date_time)
  );

  const upcomingOrders = sortedOrders.filter((order) => {
    return new Date(order.arrival_date_time) > new Date();
  });

  const pastOrders = sortedOrders.filter((order) => {
    return new Date(order.arrival_date_time) < new Date();
  });

  return (
    <div className={classes.root}>
      <Paper elevation={2}>
        <Tabs className={classes.tabBar} onClick={toggleView}>
          <Box
            className={ordersView ? classes.tabChosen : classes.tabNotChosen}
          >
            <Typography variant="h4">Orders</Typography>
          </Box>
          {user.isChef && (
            <Box
              className={!ordersView ? classes.tabChosen : classes.tabNotChosen}
            >
              <Typography variant="h4">Bookings</Typography>
            </Box>
          )}
        </Tabs>
        <Box className={classes.panelContainer}>
          <Typography variant="h6">Upcoming</Typography>
          {upcomingOrders.length ? (
            upcomingOrders.map((order) => <CustomPanel order={order} />)
          ) : (
            <Typography variant="subtitle" className={classes.noOrders}>
              No Upcoming Orders
            </Typography>
          )}
        </Box>
        <Box className={classes.panelContainer}>
          <Typography variant="h6">Past</Typography>
          {pastOrders.length ? (
            pastOrders.map((order) => <CustomPanel order={order} />)
          ) : (
            <Typography variant="subtitle" className={classes.noOrders}>
              No Past Orders
            </Typography>
          )}
        </Box>
      </Paper>
    </div>
  );
};

const CustomPanel = ({ order }) => {
  const classes = useStyles();
  const { arrival_date_time, ordered_items } = order;
  const dateObj = new Date(arrival_date_time);
  const formattedDate = format(dateObj, "MMM-dd  hh:mm a");

  const mealCards = ordered_items.map((order) => {
    const { meal_item, quantity } = order;
    const { name } = meal_item;
    return (
      <Box className={classes.mealDetailsContainer}>
        <Typography variant="h6" className={classes.mealDetails}>
          {`${quantity}  x  `}
        </Typography>
        <Typography variant="h6" className={classes.mealDetails}>
          {name}
        </Typography>
      </Box>
    );
  });

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        className={classes.expandPanel}
        expandIcon={<ExpandMore />}
      >
        <Typography>{formattedDate}</Typography>
      </ExpansionPanelSummary>
      <Box>{mealCards}</Box>
    </ExpansionPanel>
  );
};

const useStyles = makeStyles((theme) => ({
  noOrders: {
    margin: theme.spacing(3, 0, 3, 0),
  },
  expandPanel: {
    borderBottom: `0.5px solid ${theme.palette.primary.main}`,
  },
  mealDetailsContainer: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
  mealDetails: {
    padding: theme.spacing(2),
    display: "inline",
  },
  panelContainer: {
    padding: theme.spacing(3),
    "& h6": {
      color: theme.palette.primary.main,
    },
  },
  tabChosen: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  tabNotChosen: {
    backgroundColor: "lightgrey",
    color: theme.palette.error,
  },
  tabBar: {
    display: "flex",
    wrap: "flex-wrap",
    position: "relative",
    "& div": {
      flexGrow: 1,
      "& h4": {
        textAlign: "center",
        padding: theme.spacing(2),
      },
    },
  },
  root: {
    padding: theme.spacing(4),
  },
}));

export default Orders;
