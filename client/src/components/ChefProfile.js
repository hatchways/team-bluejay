import React, { useState, useContext, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChefBanner from "components/ChefBanner";
import MealItemList from "components/MealItemList";
import { useParams } from "react-router-dom";
import API from "api/index";

const ChefProfile = ({ user }) => {
  const classes = useStyles();
  const { chefId } = useParams();

  const [chef, setChef] = useState();
  const editable = user ? true : false;

  useEffect(() => {
    if (user) setChef(user);
    else {
      (async function fetchChef() {
        const { data } = await API.get(`/chefs/${chefId}`);
        setChef(data);
      })();
    }
  }, [user, chefId]);

  if (chef) {
    return (
      <Grid container>
        <ChefBanner chef={chef} editable={editable} />
        <MealItemList chef={chef} meals={chef.mealItems} editable={editable} />
      </Grid>
    );
  } else {
    return <div>Loading...</div>;
  }
};

const useStyles = makeStyles((theme) => ({}));

export default ChefProfile;
