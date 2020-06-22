import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  Typography,
  TextField,
  FormControl,
  Button,
  FormHelperText,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DialogContext } from "contexts/DialogContext";
import Dropzone from "common/DropZone";
import imagePlaceholder from "images/imagePlaceholder.jpg";
import { Context as AuthContext } from "contexts/AuthContext";
import { CuisineContext } from "contexts/CuisineContext";

const CreateMealForm = ({ meal }) => {
  const mealId = meal ? meal.id : null;
  const classes = useStyles();
  let {
    createMeal,
    editMeal,
    becomeChef,
    state: { user },
  } = useContext(AuthContext);

  const { availableCuisines } = useContext(CuisineContext);

  const [selectedCuisine, setSelectedCuisine] = useState(null);

  useEffect(() => {
    const randomCuisine =
      availableCuisines[Math.floor(Math.random() * availableCuisines.length)]
        .name;
    const defaultCuisine = user.chefCuisine || randomCuisine;
    setSelectedCuisine(defaultCuisine);
  }, [availableCuisines, user.chefCuisine]);

  const { closeDialog } = useContext(DialogContext);

  const onFormSubmit = (meal) => {
    if (meal.image === undefined) delete meal.image;

    if (!user.isChef) becomeChef(selectedCuisine, meal);
    else if (mealId) editMeal(mealId, meal);
    else createMeal(meal);

    closeDialog();
  };

  const { register, handleSubmit, errors, setValue } = useForm({
    reValidateMode: "onChange",
    validateCriteriaMode: "all",
  });

  useEffect(() => {
    register("image");
    setValue("image", image);
  });

  const [image, setImage] = useState();
  const [previewImage, setPreviewImage] = useState("");

  const fields = [
    {
      name: "name",
      label: "Meal Name",
      defaultValue: meal.name,
      type: "text",
      required: true,
    },
    {
      name: "price",
      label: "Price",
      defaultValue: meal.price,
      type: "number",
      required: true,
    },
    {
      name: "servings",
      label: "Servings",
      defaultValue: meal.servings,
      type: "number",
      required: true,
    },
    {
      name: "ingredients",
      label: "Ingredients",
      defaultValue: meal.ingredients,
      type: "text",
    },
    {
      name: "required_items",
      label: "Required Items",
      defaultValue: meal.required_items,
      type: "text",
    },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)} className={classes.form}>
        {!user.isChef && (
          <>
            <Typography variant="h5" component="h3">
              Select a Cuisine for your Chef Profile
            </Typography>
            <Box display="inline" wrap="flex-wrap">
              {availableCuisines.map((c, i) => (
                <Button
                  color={c.name === selectedCuisine ? "primary" : "default"}
                  variant="contained"
                  className={classes.cuisineButton}
                  onClick={() => setSelectedCuisine(c.name)}
                  key={i}
                >
                  {c.name}
                </Button>
              ))}
            </Box>
          </>
        )}
        <Typography variant="h5" component="h3" className={classes.mealTitle}>
          {!user.isChef
            ? "Add your first meal"
            : mealId
            ? "Edit your meal"
            : "Add a meal"}
        </Typography>
        <img
          className={classes.image}
          src={previewImage || meal.image || imagePlaceholder}
          alt="meal"
        />

        <Dropzone setImageFile={setImage} setPreviewImage={setPreviewImage} />

        {fields.map(
          ({ name, label, defaultValue = "", required, type }, index) => (
            <FormControl key={index}>
              <TextField
                variant="outlined"
                margin="normal"
                required={required}
                fullWidth
                id={name}
                className={classes.largeWidth}
                label={label}
                name={name}
                type={type}
                defaultValue={defaultValue}
                inputRef={register()}
              />
              {errors[name] && (
                <FormHelperText
                  error
                  style={{ whiteSpace: "pre-wrap" }}
                  display="inline"
                >
                  {errors[name] && errors[name].message}
                </FormHelperText>
              )}
            </FormControl>
          )
        )}
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(2, 10),
  },
  largeWidth: {
    [theme.breakpoints.up("md")]: {
      width: "75ch",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  mealTitle: {
    marginTop: theme.spacing(5),
  },
  image: {
    width: "40%",
    margin: theme.spacing(3, 5, 3, 0),
  },
  cuisineButton: {
    margin: theme.spacing(1),
  },
}));

CreateMealForm.defaultProps = {
  meal: {},
};

export default CreateMealForm;
