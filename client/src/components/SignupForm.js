import React, { useContext } from "react";
import Form from "common/Form";
import { Context as AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom";

const SignupForm = () => {
  const {
    signUp,
    state: { user },
  } = useContext(AuthContext);

  if (user) return <Redirect to="/" />;

  const fields = [
    {
      name: "name",
      label: "Full Name",
      validation: {
        required: "Name is required.",
        maxLength: { value: 50, message: "Too many characters (max: 50)." },
      },
    },
    {
      name: "email",
      label: "Email",
      validation: {
        required: "Email is required.",
        maxLength: { value: 50, message: "Too many characters (max: 50)." },
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: "Please supply a proper Email format",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      validation: {
        required: "Password is required.",
        minLength: { value: 8, message: "Too short (min: 8)." },
        pattern: {
          value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
          message: `Password must meet the following:
 - At least 1 digit (0-9).
 - At least 1 uppercase letter
 - At least one special character`,
        },
      },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      watchInput: "password",
    },
  ];

  return (
    <Form
      header="Create an account"
      onSubmit={signUp}
      fields={fields}
      submitButtonLabel="Sign Up"
    />
  );
};

export default SignupForm;
