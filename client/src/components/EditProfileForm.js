import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  Typography,
  TextField,
  FormControl,
  Button,
  FormHelperText,
  Avatar,
  Box,
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Context as UserContext } from "contexts/AuthContext";
import Dropzone from "common/DropZone";
import API from "api";

const EditProfileForm = ({ onSubmit }) => {
  let {
    state: { user },
  } = useContext(UserContext);

  const [cuisines, setCuisines] = useState([]);
  const [profileImage, setProfileImage] = useState();
  const [previewImage, setPreviewImage] = useState("");
  const [chefCuisine, setChefCuisine] = useState(user.chefCuisine);

  const classes = useStyles();

  useEffect(() => {
    (async function getCuisines() {
      const { data: allCuisines } = await API.get("/cuisines");
      setCuisines(allCuisines);
    })();
  }, []);

  const { register, handleSubmit, errors, setValue } = useForm({
    reValidateMode: "onChange",
    validateCriteriaMode: "all",
  });

  const [selectedCuisines, setSelectedCuisines] = useState(
    user.cuisines.map((cuisine) => cuisine.id)
  );

  useEffect(() => {
    register("cuisines");
    register("chefCuisine");
    register("profileImage");
  });
  useEffect(() => {
    setValue(
      "cuisines",
      selectedCuisines.map((cuisineId) => ({ id: cuisineId }))
    );
    setValue("chefCuisine", chefCuisine);
    setValue("profileImage", profileImage);
  });

  const fields = [
    {
      component: TextField,
      name: "name",
      label: "Full Name",
      inputClass: "largeWidth",
      defaultValue: user.name,
      validation: {
        required: "Name is required.",
        maxLength: { value: 50, message: "Too many characters (max: 50)." },
      },
    },
    {
      component: TextField,
      name: "aboutMe",
      label: "About Me",
      inputClass: "largeWidth",
      defaultValue: user.aboutMe,
      multiline: true,
      rows: 5,
    },
    {
      component: TextField,
      name: "chefProfile",
      label: "Chef Profile",
      inputClass: "largeWidth",
      defaultValue: user.chefProfile,
      multiline: true,
      rows: 5,
    },
    {
      component: TextField,
      name: "address",
      label: "Address",
      defaultValue: user.address,
      inputClass: "largeWidth",
      validation: {
        required: "Address is required.",
      },
    },
  ].filter((field) => {
    // remove chefProfile field is user is not a chef
    return user.isChef ? true : field.name !== "chefProfile";
  });

  return (
    <>
      <Typography component="h1" variant="h5">
        Edit your profile
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
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

        <Dropzone
          setImageFile={setProfileImage}
          setPreviewImage={setPreviewImage}
        />

        {fields.map(
          (
            {
              component: Component = TextField,
              inputClass = "",
              name,
              label,
              type = "text",
              defaultValue,
              validation,
              multiline = false,
              rows,
            },
            index
          ) => (
            <FormControl key={index}>
              <Component
                variant="outlined"
                margin="normal"
                required
                id={name}
                className={classes[inputClass]}
                label={label}
                name={name}
                autoComplete={name}
                type={type}
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
        <Typography component="h6" variant="h6">
          Favorite Cuisines:
        </Typography>
        <Box>
          {cuisines.map((cuisine) => {
            const isSelected = selectedCuisines.includes(cuisine.id);
            return (
              <Button
                className={classes.button}
                color={isSelected ? "primary" : "default"}
                variant="contained"
                key={cuisine.id}
                onClick={() =>
                  isSelected
                    ? setSelectedCuisines(
                        selectedCuisines.filter(
                          (cuisineId) => cuisineId !== cuisine.id
                        )
                      )
                    : setSelectedCuisines([...selectedCuisines, cuisine.id])
                }
              >
                {cuisine.name}
                {isSelected && <Clear />}
              </Button>
            );
          })}
        </Box>
        {user.isChef && (
          <Box>
            <Typography component="h6" variant="h6">
              Chef Cuisine
            </Typography>
            {cuisines.map((cuisine) => (
              <Button
                className={classes.button}
                color={cuisine.name === chefCuisine ? "primary" : "default"}
                variant="contained"
                onClick={() => setChefCuisine(cuisine.name)}
              >
                {cuisine.name}
              </Button>
            ))}
          </Box>
        )}
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
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

export default EditProfileForm;
