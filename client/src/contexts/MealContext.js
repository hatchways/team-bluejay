import React, { useReducer, useContext } from "react";
import API from "api/index";
import { Context as AlertContext } from "contexts/AlertContext";

const reducer = (state, action) => {
  switch (action.type) {
    // case "createMeal":
    //   return {
    //     ...state,
    //     menuItems: action.payload.data,
    //     errorMessage: "",
    //   };
    default:
      return state;
  }
};

const Context = React.createContext();

const Provider = ({ children }) => {
  const { alert } = useContext(AlertContext);
  const [state, dispatch] = useReducer(reducer, {
    shoppingCart: [],
    errorMessage: "",
  });

  const createMeal = async (meal) => {
    try {
      await API.post("/meal_items", meal);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const getMenuItems = async (userId) => {
    try {
      const { data } = await API.get("/meal_items", {
        params: {
          chefId: userId,
        },
      });
      return data;
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Context.Provider value={{ state, createMeal, getMenuItems }}>
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
