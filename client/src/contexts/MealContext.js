import React, { useReducer, useContext, useState, useEffect } from "react";
import API from "api/index";
import { Context as AlertContext } from "contexts/AlertContext";
import Dialog from "common/Dialog";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const Context = React.createContext();

const Provider = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const { alert } = useContext(AlertContext);

  const [chefId, setChefId] = useState(null);
  const [shoppingCart, setShoppingCart] = useState([]);

  useEffect(() => {
    updateFromLocalStorage();
  }, []);

  const updateFromLocalStorage = () => {
    const lsItems = JSON.parse(localStorage.getItem("shoppingCart"));
    const lsChefId = JSON.parse(localStorage.getItem("chefId"));
    if (lsItems && lsChefId) {
      setChefId(lsChefId);
      setShoppingCart(lsItems);
    }
  };

  const updateToLocalStorage = () => {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    localStorage.setItem("chefId", JSON.stringify(chefId));
    console.log(shoppingCart);
    console.log(chefId);
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
      setPending({ mealItem, id });
      console.log(pending);
    }
  };

  const addToCart = async (mealItem, chefId) => {
    setShoppingCart([...shoppingCart, mealItem]);
    setChefId(chefId);
    alert("Added to cart", "success");
    updateToLocalStorage();
  };

  const replaceCart = async (items = [], chefId) => {
    setShoppingCart(items);
    setChefId(chefId);
    updateToLocalStorage();
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setPending(null);
    alert("Item not added to cart", "info");
  };

  const handleConfirm = () => {
    replaceCart([pending.mealItem], pending.chefId);
    setPending(null);
    setDialogOpen(false);
  };

  return (
    <Context.Provider value={{ shoppingCart, getMenuItems, checkCartStatus }}>
      {children}
      <Dialog
        isOpen={dialogOpen}
        handleClose={handleCancel}
        title="Are you sure? You have items from another chef, these will be emptied and replaced."
      >
        <Button color="primary" onClick={handleConfirm}>
          Go ahead
        </Button>
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Dialog>
    </Context.Provider>
  );
};

export { Provider, Context };
