import React from "react";
import AuthPage from "../components/AuthPage";
import LoginForm from "../components/LoginForm";

const LoginScreen = ({ props }) => {
  return (
    <AuthPage
      Form={LoginForm}
      navigateToLabel="Sign Up"
      navigateTo="/signup"
      linkTitle="Don't have an account?"
    />
  );
};

export default LoginScreen;
