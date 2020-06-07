import React, { useReducer, useContext } from "react";
import API from "api/index";
import { Context as AlertContext } from "contexts/AlertContext";

const reducer = (state, action) => {
  switch (action.type) {
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

  return (
    <Context.Provider value={{ state, getMenuItems }}>
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
