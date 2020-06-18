import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { Context as AuthContext } from "contexts/AuthContext";

const ProtectedRoute = (props) => {
  const {
    state: { user },
  } = useContext(AuthContext);

  if (user) {
    return <Route {...props} />;
  } else {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: props.location },
        }}
      />
    );
  }
};

export default ProtectedRoute;
