import React, { useReducer, useContext } from "react";
import API from "api/index";
import { useHistory, useLocation } from "react-router-dom";
import { Context as AlertContext } from "contexts/AlertContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { user: action.payload.user, errorMessage: "" };
    case "signOut":
      return { user: null, errorMessage: "" };
    case "serverError":
    case "signUpError":
      return { ...state, errorMessage: action.payload };
    case "signUp":
      return { user: action.payload.user, errorMessage: "" };
    case "clearErrorMessage":
      return { ...state, errorMessage: "" };
    case "refreshUser":
      return { user: action.payload.user, errorMessage: "" };
    default:
      return state;
  }
};

const Context = React.createContext();

const Provider = ({ children }) => {
  const { alert } = useContext(AlertContext);
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    errorMessage: "",
  });

  let history = useHistory();
  let location = useLocation();

  const signUp = async (user) => {
    try {
      const { data } = await API.post("/users", user);
      dispatch({ type: "signUp", payload: { user: data.user } });
      history.push("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  const login = async ({ email, password }) => {
    try {
      const { data } = await API.post("/users/login", { email, password });
      dispatch({ type: "login", payload: { user: data.user } });
      let { from } = location.state || { from: { pathname: "/" } };
      history.replace(from);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const clearErrorMessage = () => dispatch({ type: "clearErrorMessage" });

  const signOut = async () => {
    try {
      await API.post("/users/logout");
      dispatch({ type: "signOut" });
      history.push("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const refreshLoggedInUser = async () => {
    try {
      const { data } = await API.get("/users/login");
      dispatch({ type: "login", payload: { user: data.user } });
    } catch (error) {
      return;
    }
  };

  return (
    <Context.Provider
      value={{
        state,
        signUp,
        login,
        clearErrorMessage,
        signOut,
        refreshLoggedInUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
