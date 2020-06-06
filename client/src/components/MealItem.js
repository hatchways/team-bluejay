import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditMealButton from "components/EditMealButton";

const MealItem = ({ meal, editable }) => {
  const classes = useStyles();
  const { image } = meal;

  return (
    <Card className={classes.root} elevation={2}>
      {editable && <EditMealButton />}
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Chip
            label={`Meal for ${meal.servings}`}
            color="primary"
            className={classes.tagLine}
          />
          <Typography
            classes={{ root: classes.boldCapitalText }}
            component="h6"
            variant="h6"
          >
            {meal.name}
          </Typography>
          <Typography
            classes={{ root: classes.price }}
          >{`$ ${meal.price}`}</Typography>
          <Typography classes={{ root: classes.boldCapitalText }}>
            Ingredients:
          </Typography>
          <Typography>{meal.ingredients}</Typography>
          <div className={classes.spacer} />
          <Typography classes={{ root: classes.boldCapitalText }}>
            Requirements:
          </Typography>
          <Typography>{meal.requirements}</Typography>
        </CardContent>
      </div>
      <CardMedia className={classes.image} image={image} />
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    height: theme.spacing(35),
    display: "flex",
    padding: theme.spacing(5),
    position: "relative",
  },
  image: {
    width: "40%",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    maxWidth: "55%",
    paddingRight: theme.spacing(2),
  },
  content: {
    flex: "1 0 auto",
  },
  tagLine: {
    marginBottom: theme.spacing(2),
  },
  price: {
    color: "#ff743d",
    fontWeight: "700",
    margin: theme.spacing(1),
  },
  boldCapitalText: {
    fontWeight: "700",
    textTransform: "uppercase",
  },
  boldText: {
    fontWeight: "500",
  },
  spacer: {
    margin: theme.spacing(1),
  },
}));
export default MealItem;
