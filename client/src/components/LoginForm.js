import React, { useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import Form from "common/Form";
import { Context as AuthContext } from "contexts/AuthContext";

const LoginForm = () => {
  const {
    login,
    state: { user },
  } = useContext(AuthContext);

  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  if (user) return <Redirect to={from} />;

  const fields = [
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
      },
    },
  ];

  return (
    <Form
      header="Login"
      onSubmit={login}
      fields={fields}
      submitButtonLabel="Login"
    />
  );
};

export default LoginForm;
