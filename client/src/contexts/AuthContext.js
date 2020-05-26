import React, { useReducer } from "react";
import API from "api/index";
import { useHistory, useLocation } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { user: action.payload.user, errorMessage: "" };
    case "signOut":
      return { user: null, errorMessage: "" };
    case "serverError":
    case "signUpError":
      return { ...state, errorMessage: action.payload };
    case "signup":
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

//fake user until real login flow has been implemented
const fakeUser = { name: "John Smith" };
//fake chef until real flow has been implemented
const fakeChef = { name: "Chef" , isChef: true};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    errorMessage: "",
  });

  let history = useHistory();
  let location = useLocation();

  const signUp = async ({ email, password }) => {
    // TODO call back end
    dispatch({ type: "signUp", payload: { user: fakeUser } });
    history.push("/");
  };
  const login = async ({ email, password }) => {
    // TODO call back end
    dispatch({ type: "login", payload: { user: fakeUser } });
    // We are trying to redirect the user to the page he was attempting to visit before he got redirected to login
    let { from } = location.state || { from: { pathname: "/" } };
    history.replace(from);
  };

  const clearErrorMessage = () => dispatch({ type: "clearErrorMessage" });

  const signOut = async () => {
    // TODO call back end
    dispatch({ type: "signOut" });
    history.push("/login");
  };

  const refreshUser = async() => {
    // TODO call backend
    dispatch({type: "refreshUser", payload: { user: fakeChef } });
  }

  return (
    <Context.Provider
      value={{ state, signUp, login, clearErrorMessage, signOut, refreshUser }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
