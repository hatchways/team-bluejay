import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  Typography,
  TextField,
  FormControl,
  Button,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context as UserContext } from "contexts/AuthContext";
import { DialogContext } from "contexts/DialogContext";
import Dropzone from "common/DropZone";
import API from "api";
import imagePlaceholder from "images/imagePlaceholder.jpg";

const CreateMealForm = ({ meal }) => {
  const mealId = meal ? meal.id : "";
  const classes = useStyles();
  let { createMeal, editMeal } = useContext(UserContext);

  const { closeDialog } = useContext(DialogContext);

  const onFormSubmit = (meal) => {
    if (mealId) editMeal(mealId, meal);
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
      validation: {
        required: "Meal Name is required.",
      },
    },
    {
      name: "price",
      label: "Price",
      defaultValue: meal.price,
      validation: {
        required: "Price is required.",
        pattern: {
          value: /\d+/,
          message: "Please supply a proper price",
        },
      },
    },
    {
      name: "servings",
      label: "Servings",
      defaultValue: meal.servings,
      validation: {
        required: "Servings is required.",
        pattern: {
          value: /^\d+$/,
          message: "Please supply a proper serving size",
        },
      },
    },
    {
      name: "description",
      label: "Description",
      defaultValue: meal.description,
      multiline: true,
      rows: 2,
    },
    {
      name: "ingredients",
      label: "Ingredients",
      defaultValue: meal.ingredients,
    },
    {
      name: "required_items",
      label: "Required Items",
      defaultValue: meal.required_items,
    },
  ];

  return (
    <>
      <Typography component="h1" variant="h5">
        Add your first meal to become a chef
      </Typography>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={classes.form}
        noValidate
      >
        <img
          className={classes.image}
          src={previewImage || meal.image || imagePlaceholder}
          alt="meal"
        />

        <Dropzone setImageFile={setImage} setPreviewImage={setPreviewImage} />

        {fields.map(
          (
            {
              name,
              label,
              defaultValue = "",
              validation,
              multiline = false,
              rows,
            },
            index
          ) => (
            <FormControl key={index}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id={name}
                className={classes.largeWidth}
                label={label}
                name={name}
                autoComplete={name}
                type="text"
                multiline={multiline}
                rows={rows}
                defaultValue={defaultValue}
                autoFocus={index === 0}
                inputRef={register(validation)}
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
  image: {
    width: "40%",
    margin: theme.spacing(3, 5, 3, 0),
  },
}));

CreateMealForm.defaultProps = {
  meal: {},
};

export default CreateMealForm;
