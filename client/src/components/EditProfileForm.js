import React, { useContext, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  TextField,
  Select,
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  Chip,
  Button,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import { Context as UserContext } from "contexts/AuthContext";

function MyDropzone() {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

const EditProfileForm = ({ onSubmit }) => {
  const classes = useStyles();
  let {
    state: { user },
  } = useContext(UserContext);

  // added by kareem for the sake of the demo only
  // replacing the actual logged in user with a fake user
  const fakeUser = {
    name: "Atsushi Mikazuki",
    aboutMe: "I am a nice person who likes expensive food at a cheap price",
    address: "123 Merry lane",
    city: "Pirate Bay",
    state: "Toronto",
    zipcode: "M4B 1B3",
    country: "Canada",
    cuisines: ["Japanese", "Chinese"],
  };
  user = fakeUser;

  const { register, handleSubmit, errors, control } = useForm({
    reValidateMode: "onChange",
    validateCriteriaMode: "all",
  });

  // TODO: Add validation to street, address, location, city, state, country, zipcode fields to ensure it is a proper address on google maps
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
      validation: {
        required: "Please provide a description about you",
      },
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
    {
      component: TextField,
      name: "city",
      label: "City",
      defaultValue: user.city,
      inputClass: "mediumWidth",
      validation: {
        required: "City is required.",
      },
    },
    {
      component: TextField,
      name: "state",
      label: "State",
      defaultValue: user.state,
      inputClass: "smallWidth",
    },
    {
      component: TextField,
      name: "zipcode",
      label: "Zipcode",
      defaultValue: user.zipcode,
      inputClass: "smallWidth",
      validation: {
        required: "Zipcode is required.",
      },
    },
    {
      component: TextField,
      inputClass: "mediumWidth",
      name: "country",
      label: "Country",
      defaultValue: user.country,
      validation: {
        required: "Country is required.",
      },
    },
  ];
  const cuisines = [
    "Japanese",
    "Martian",
    "American",
    "Chinese",
    "Middle Eastern",
  ];

  return (
    <>
      <Typography component="h1" variant="h5">
        Edit your profile
      </Typography>
      {/* TODO:  add fullWidth to all input components (so that they expand the whole dialog)
                 use Grids for some of the components so that entire form width will expand equally the width of the dialog*/}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={classes.form}
        noValidate
      >
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
        {/* TODO: Add option to add customized cuisines */}
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-chip-label">
              Favorite Cuisines
            </InputLabel>
            <Controller
              as={
                <Select
                  labelId="cuisines-label"
                  id="cuisines"
                  multiple
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                          color="primary"
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {cuisines.map((cuisine) => (
                    <MenuItem
                      key={cuisine}
                      value={cuisine}
                      className={classes.menuItem}
                    >
                      {cuisine}
                    </MenuItem>
                  ))}
                </Select>
              }
              name="cuisines"
              rules={{ required: "Please list at least one cuisine" }}
              control={control}
              defaultValue={user.cuisines}
            />
          </FormControl>
        </div>
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
  shortWidth: {
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
  },
  mediumWidth: {
    [theme.breakpoints.up("md")]: {
      width: "50ch",
    },
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
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  menuItem: {
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default EditProfileForm;
