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
    case "updateUser":
      return { user: action.payload.user, errorMessage: "" };
    case "updateMenuItems":
      return {
        ...state,
        menuItems: action.payload.menuItems,
        errorMessage: "",
      };
    default:
      return state;
  }
};

const Context = React.createContext();

const Provider = ({ children }) => {
  const { alert } = useContext(AlertContext);
  const [state, dispatch] = useReducer(reducer, {
    menuItems: [],
    user: null,
    errorMessage: "",
  });

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
      updateMenuItems(data.user.id);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      //remove when cuisines has been implemented
      delete updatedUser.cuisines;
      const { data } = await API.put("/users", {
        ...updatedUser,
      });
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

  const refreshLoggedInUser = async () => {
    try {
      const { data } = await API.get("/users/login");
      dispatch({ type: "refreshUser", payload: { user: data.user } });
      updateMenuItems(data.user.id);
    } catch (error) {
      alert("Unable to refresh user");
      return;
    }
  };

  const updateMenuItems = async (userId) => {
    try {
      const { data } = await API.get("/meal_items", {
        params: {
          chefId: userId,
        },
      });
      dispatch({
        type: "updateMenuItems",
        payload: { menuItems: data },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
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
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
