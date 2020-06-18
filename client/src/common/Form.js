import React from "react";
import { useForm } from "react-hook-form";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const Form = ({ header, onSubmit, fields, submitButtonLabel }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, watch } = useForm({
    reValidateMode: "onChange",
    validateCriteriaMode: "all",
  });

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        {header}
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={classes.form}
        noValidate
      >
        {fields.map(
          ({ name, label, type = "text", validation, watchInput }, index) => (
            <FormControl key={name} fullWidth>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id={name}
                label={label}
                name={name}
                autoComplete={name}
                type={type}
                autoFocus={index === 0}
                inputRef={
                  watchInput
                    ? register({
                        validate: (value) =>
                          value === watch(watchInput) ||
                          "The passwords do not match",
                      })
                    : register(validation)
                }
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {submitButtonLabel}
        </Button>
      </form>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(2, 10),
  },
}));

export default Form;
