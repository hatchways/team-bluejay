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
  const [chef, setChef] = useState(user);
  const editable = user ? true : false;

  const fetchChef = async () => {
    const { data } = await API.get(`/chefs/${chefId}`);
    setChef(data);
  };

  useEffect(() => {
    if (!chef) {
      fetchChef();
    }
  }, []);

  if (chef) {
    return (
      <div className={classes.root}>
        <Grid container>
          <ChefBanner chef={chef} editable={editable} />
          <MealItemList
            chef={chef}
            meals={chef.mealItems}
            editable={editable}
          />
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
