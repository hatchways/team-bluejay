import React, { useReducer, useContext, useEffect } from "react";
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
    case "updateUser":
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

  useEffect(() => {
    // Check if user is logged in on first visit to application
    refreshLoggedInUser("login");
  }, []);

  let history = useHistory();
  let location = useLocation();

  const handleErrorResponse = (error) => {
    for (const [key, value] of Object.entries(error.response.data)) {
      console.error(`${key} : ${value}`);
      if (key === "error" || key === "message" || key === "address") {
        alert(value);
      }
    }
  };

  const signUp = async (user) => {
    try {
      const { data } = await API.post("/users", user);
      dispatch({ type: "signUp", payload: { user: data.user } });
      history.push("/");
    } catch (error) {
      handleErrorResponse(error);
    }
  };
  const login = async ({ email, password }) => {
    try {
      const { data } = await API.post("/users/login", { email, password });
      dispatch({ type: "login", payload: { user: data.user } });
      let { from } = location.state || { from: { pathname: "/" } };
      history.replace(from);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      console.log(updatedUser);

      const formData = new FormData();
      for (const [key, value] of Object.entries(updatedUser)) {
        //Objects such as arrays need to be stringifed when sending as multipart/form-data
        if (key === "profileImage" && value === undefined) continue;
        if (key === "cuisines") formData.set(key, JSON.stringify(value));
        else formData.set(key, value);
      }

      const { data } = await API.put("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(data);
      dispatch({ type: "updateUser", payload: { user: data.user } });
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const clearErrorMessage = () => dispatch({ type: "clearErrorMessage" });

  const signOut = async () => {
    try {
      await API.post("/users/logout");
      dispatch({ type: "signOut" });
      history.push("/login");
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const refreshLoggedInUser = async (action = "refresh") => {
    try {
      const { data } = await API.get("/users/login");
      dispatch({ type: "refreshUser", payload: { user: data.user } });
    } catch (error) {
      alert(`Unable to ${action} user`);
      return;
    }
  };

  const createMeal = async (meal) => {
    try {
      await API.post("/meal_items", meal);
      refreshLoggedInUser();
    } catch (error) {
      handleErrorResponse(error);
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
        updateUser,
        refreshLoggedInUser,
        createMeal,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
