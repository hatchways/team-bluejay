import React, { useReducer, useContext, useState, useEffect } from "react";
import API from "api/index";
import { Context as AlertContext } from "contexts/AlertContext";
import Dialog from "common/Dialog";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const Context = React.createContext();

const Provider = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { alert } = useContext(AlertContext);

  const [chefId, setChefId] = useState(null);
  const [shoppingCart, setShoppingCart] = useState([]);

  useEffect(() => {
    updateFromLocalStorage();
  }, []);

  useEffect(() => {
    updateToLocalStorage();
  }, [chefId, shoppingCart]);

  const updateFromLocalStorage = () => {
    try {
      const lsItems = JSON.parse(localStorage.getItem("shoppingCart"));
      const lsChefId = JSON.parse(localStorage.getItem("chefId"));
      if (lsItems && lsChefId) {
        setChefId(lsChefId);
        setShoppingCart(lsItems);
      }
      console.info("updated cart from localstorage");
    } catch (e) {
      console.error(e);
    }
  };

  const updateToLocalStorage = () => {
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
    if (id === chefId || !chefId) {
      addToCart(mealItem, id);
    } else {
      setDialogOpen(true);
    }
  };

  const addToCart = (mealItem, id) => {
    setChefId(id);
    setShoppingCart([mealItem, ...shoppingCart]);

    alert("Added to cart", "info");
  };

  const emptyCart = () => {
    setChefId(null);
    setShoppingCart([]);
    localStorage.removeItem("shoppingCart");
    localStorage.removeItem("chefId");
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
    <Context.Provider value={{ shoppingCart, getMenuItems, checkCartStatus }}>
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
