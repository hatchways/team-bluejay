import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { Context as AuthContext } from "contexts/AuthContext";

const ProtectedRoute = ({ render, ...rest }) => {
  const {
    state: { user },
  } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          render(props)
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
export default ProtectedRoute;
