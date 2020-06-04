import React, { useReducer } from "react";
import API from "api/index";

const reducer = (state, action) => {
  switch (action.type) {
    case "createMeal":
      return {
        meals: [...state.meals, action.payload.createdMeal],
        errorMessage: "",
      };
    default:
      return state;
  }
};

const Context = React.createContext();

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    shoppingCart: [],
    meals: [],
    errorMessage: "",
  });

  const createMeal = async (meal) => {
    try {
      const { data } = await API.post("/meal_items", meal);
      dispatch({
        type: "createMeal",
        payload: { createdMeal: data.meal },
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Context.Provider value={{ state, createMeal }}>
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
