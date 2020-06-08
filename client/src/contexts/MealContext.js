import React, { useReducer, useContext, useState, useEffect } from "react";
import API from "api/index";
import { Context as AlertContext } from "contexts/AlertContext";
import Dialog from "common/Dialog";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const reducer = (state, action) => {
  const { shoppingCart } = state;
  const { mealItem, chefId } = action.payload;
  switch (action.type) {
    case "addToCart":
      if (shoppingCart.find((item) => item.id === mealItem.id)) {
        const updatedCart = shoppingCart.map((item) => {
          if (item.id === mealItem.id) item.quantity += 1;
          return item;
        });
        return { shoppingCart: updatedCart, chefId };
      } else {
        mealItem.quantity = 1;
        return { shoppingCart: [...shoppingCart, mealItem], chefId };
      }
    case "removeFromCart":
      const filteredCart = [];
      shoppingCart.forEach((item) => {
        if (item.id === mealItem.id) {
          item.quantity -= 1;
        }
        if (item.quantity > 0) {
          filteredCart.push(item);
        }
      });
      if (!filteredCart.length) return { shoppingCart: [], chefId: null };
      return { ...state, shoppingCart: filteredCart };

    case "emptyCart":
      return {
        shoppingCart: [],
        chefId: null,
      };
    case "replaceCart":
      return {
        shoppingCart: action.payload.shoppingCart,
        chefId: action.payload.chefId,
      };
    default:
      return state;
  }
};

const Context = React.createContext();

const Provider = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { alert } = useContext(AlertContext);

  // const [chefId, setChefId] = useState(null);
  // const [shoppingCart, setShoppingCart] = useState([]);

  const [state, dispatch] = useReducer(reducer, {
    shoppingCart: [],
    chefId: null,
  });

  useEffect(() => {
    updateFromLocalStorage();
  }, []);

  useEffect(() => {
    updateToLocalStorage();
    console.log(state);
  }, [state.chefId, state.shoppingCart]);

  const updateFromLocalStorage = () => {
    try {
      const lsItems = JSON.parse(localStorage.getItem("shoppingCart"));
      const lsChefId = JSON.parse(localStorage.getItem("chefId"));
      if (lsItems && lsChefId) {
        dispatch({
          type: "replaceCart",
          payload: { shoppingCart: lsItems, chefId: lsChefId },
        });
      }
      console.info("updated cart from localstorage");
    } catch (e) {
      console.error(e);
    }
  };

  const updateToLocalStorage = () => {
    const { chefId, shoppingCart } = state;
    if (chefId && shoppingCart) {
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
      localStorage.setItem("chefId", JSON.stringify(chefId));
    } else {
      localStorage.removeItem("shoppingCart");
      localStorage.removeItem("chefId");
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
      alert("Unable to get meal items");
    }
  };

  const checkCartStatus = (mealItem, id) => {
    const { chefId } = state;
    if (id === chefId || !chefId) {
      addToCart(mealItem, id);
    } else {
      setDialogOpen(true);
    }
  };

  const addToCart = (mealItem, id) => {
    dispatch({ type: "addToCart", payload: { mealItem, chefId: id } });
    alert("Added to cart", "info");
  };

  const removeFromCart = (mealItem) => {
    dispatch({ type: "removeFromCart", payload: { mealItem } });
  };

  const emptyCart = () => {
    dispatch({ type: "emptyCart", payload: {} });
    alert("Cart has been emptied", "info");
  };

  const handleCancel = () => {
    setDialogOpen(false);
    alert("Item not added to cart", "info");
  };

  const handleEmpty = () => {
    emptyCart();
    setDialogOpen(false);
  };

  return (
    <Context.Provider
      value={{ state, getMenuItems, checkCartStatus, removeFromCart }}
    >
      {children}
      <Dialog
        isOpen={dialogOpen}
        handleClose={handleCancel}
        title="You have items from another chef, please empty your cart first."
      >
        <Button color="primary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleEmpty}>Empty My Cart</Button>
      </Dialog>
    </Context.Provider>
  );
};

export { Provider, Context };
