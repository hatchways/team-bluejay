import React, { useState, useEffect } from "react";
import { Grid, Paper, Avatar, Chip, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Image from "material-ui-image";
import ChefBanner from "components/ChefBanner";
import Navbar from "components/Navbar";
import MealItemList from "components/MealItemList";
import { useParams, useHistory, useLocation, Redirect } from "react-router-dom";
import { Context as UserContext } from "contexts/AuthContext";
import API from "api/index";

const ChefProfile = ({ user }) => {
  const classes = useStyles();
  const { chefId } = useParams();
  const [chef, setChef] = useState(null);

  const fetchChef = async () => {
    const { data } = await API.get(`/chefs/${chefId}`);
    setChef(data);
  };

  // user will be passed as props from Profile page
  if (user) {
    return (
      <div className={classes.root}>
        <Grid container>
          <ChefBanner chef={user} editable={true} />
          <MealItemList
            chefName={user.name}
            meals={user.meals}
            editable={true}
          />
        </Grid>
      </div>
    );
  } else {
    fetchChef();
  }

  if (chef) {
    return (
      <div className={classes.root}>
        <Grid container>
          <ChefBanner chef={chef} />
          <MealItemList chefName={chef.name} meals={chef.meals} />
        </Grid>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(10),
  },
}));

export default ChefProfile;
