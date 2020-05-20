import React from "react";
import AuthPage from "components/AuthPage";
import SignUpForm from "components/SignupForm";

const SignUpScreen = ({ props }) => {
  return (
    <AuthPage
      Form={SignUpForm}
      navigateToLabel="Login"
      navigateTo="/login"
      linkTitle="Already a member?"
    />
  );
};

export default SignUpScreen;
