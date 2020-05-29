import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const MealItem = ({ meal }) => {
  const classes = useStyles();
  const { image } = meal;
  console.log(meal);
  return (
    <Card className={classes.root} elevation="2">
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            Live From Space
          </Typography>
        </CardContent>
      </div>
      <CardMedia className={classes.image} image={image} />
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    height: theme.spacing(30),
    display: "flex",
    padding: theme.spacing(5),
  },
  image: {
    width: "40%",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  content: {
    flex: "1 0 auto",
  },
}));
export default MealItem;
