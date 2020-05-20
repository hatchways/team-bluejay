import React from "react";
import Form from "./common/Form";

const LoginForm = ({ props }) => {
  const onSubmit = (data) => {
    console.log(data);
  };

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
        minLength: { value: 8, message: "Too short (min: 8)." },
        pattern: {
          value: /(?=[0-9])(?=.*[A-Z])/,
          message: `Password must meet the following:
 - At least 1 digit (0-9).
 - At least 1 uppercase character`,
        },
      },
    },
  ];

  return <Form header="Login" onSubmit={onSubmit} fields={fields} />;
};

export default LoginForm;
