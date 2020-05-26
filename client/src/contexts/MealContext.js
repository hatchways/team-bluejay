import React, { useReducer } from "react";
import { useHistory, useLocation } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "createMeal":
      return { meals: [...state.meals, action.payload.createdMeal], errorMessage: "" };
    default:
      return state;
  }
};

const Context = React.createContext();

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    meals: [],
    errorMessage: "",
  });

  let history = useHistory();
  let location = useLocation();


  const createMeal = async({mealName, description}) => {
    // do backend call
    dispatch({ 
      type: "createMeal", 
      payload: { createdMeal: 
        { mealName, description }
    }});
    // go back to previous page
    let { from } = location.state || { from: { pathname: "/" } };
    history.replace(from);
  }

  return (
    <Context.Provider
      value={{ state, createMeal }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
