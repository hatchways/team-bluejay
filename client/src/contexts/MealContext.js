import React, { useReducer, useContext } from "react";
import API from "api/index";
import { Context as AlertContext } from "contexts/AlertContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "addItem":
      return {
        shoppingCart: [...state.shoppingCart, { item: "1" }],
        ...state,
      };
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

  const addItem = (mealItem) => {
    try {
      // dispatch({ type: "addItem", payload: { item: mealItem } });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Context.Provider value={{ state, getMenuItems, addItem }}>
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
