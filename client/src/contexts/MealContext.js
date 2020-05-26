import React, { useReducer } from "react";
// import API from "api/index";
// import { useHistory, useLocation } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "createMeal":
      return { user: action.payload.user, errorMessage: "" };
    default:
      return state;
  }
};

const Context = React.createContext();

//fake meal real flow has been implemented
const fakeMeal = { name: "Eggs" };

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    meal: null,
    errorMessage: "",
  });

  // let history = useHistory();
  // let location = useLocation();

  const createMeal = async ({ name, description }) => {
    // TODO call back end
    dispatch({ type: "createMeal", payload: { meal: fakeMeal } });
    alert("create meal");
    // history.push("/");
  };
  

  return (
    <Context.Provider
      value={{ state, createMeal}}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
