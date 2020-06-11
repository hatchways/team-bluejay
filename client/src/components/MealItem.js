import React, { useContext } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context as MealContext } from "contexts/MealContext";
import imagePlaceholder from "images/imagePlaceholder.jpg";
import { Edit } from "@material-ui/icons";
import CreateMealForm from "components/CreateMealForm";
import { DialogContext } from "contexts/DialogContext";

const MealItem = ({ meal, editable, chefId }) => {
  const classes = useStyles();
  const { checkCartStatus } = useContext(MealContext);
  const { openDialog } = useContext(DialogContext);

  return (
    <Card className={classes.root} elevation={2}>
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
          <Typography>{meal.required_items}</Typography>
          {editable ? (
            <Button
              variant="outlined"
              className={classes.editMeal}
              onClick={() => openDialog(<CreateMealForm meal={meal} />)}
            >
              <Edit />
              Edit meal
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              className={classes.addToCart}
              onClick={() => checkCartStatus(meal, chefId)}
            >
              Add to Cart
            </Button>
          )}
        </CardContent>
      </div>
      <CardMedia
        className={classes.image}
        image={meal.image || imagePlaceholder}
      />
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    display: "flex",
    position: "relative",
  },
  addToCart: {
    marginTop: theme.spacing(1),
  },
  image: {
    width: "40%",
    margin: theme.spacing(3, 5, 3, 0),
  },
  details: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    maxWidth: "55%",
    padding: theme.spacing(2, 5, 0, 0),
    margin: theme.spacing(3, 0, 3, 3),
  },
  content: {
    flex: "1 0 auto",
    padding: 0,
  },
  tagLine: {
    marginLeft: theme.spacing(0),
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
  editMeal: {
    marginTop: theme.spacing(3),
    width: theme.spacing(25),
  },
}));
export default MealItem;
