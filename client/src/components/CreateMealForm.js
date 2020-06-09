import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  Typography,
  TextField,
  FormControl,
  Button,
  FormHelperText,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context as UserContext } from "contexts/AuthContext";
import { DialogContext } from "contexts/DialogContext";
import Dropzone from "common/DropZone";
import API from "api";

const CreateMealForm = () => {
  const classes = useStyles();
  let {
    state: { user },
    createMeal,
  } = useContext(UserContext);

  const { closeDialog } = useContext(DialogContext);

  const onFormSubmit = (meal) => {
    console.log(meal);
    createMeal(meal);
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
      validation: {
        required: "Meal Name is required.",
      },
    },
    {
      name: "price",
      label: "Price",
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
      multiline: true,
      rows: 2,
    },
    {
      name: "ingredients",
      label: "Ingredients",
    },
    {
      name: "required_items",
      label: "Required Items",
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
        <Avatar
          src={
            previewImage
              ? previewImage
              : user.profileImage
              ? user.profileImage
              : ""
          }
          alt="profile"
          className={classes.avatar}
        />

        <Dropzone setImageFile={setImage} setPreviewImage={setPreviewImage} />

        {fields.map(
          (
            { name, label, defaultValue, validation, multiline = false, rows },
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
  avatar: {
    width: theme.spacing(25),
    height: theme.spacing(25),
    border: "solid white 5px",
    boxShadow: "0 0 10px lightgrey",
    marginBottom: theme.spacing(3),
  },
}));

export default CreateMealForm;
