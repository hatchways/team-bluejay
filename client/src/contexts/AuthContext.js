import React, { useReducer, useContext, useEffect } from "react";
import API from "api/index";
import { useHistory, useLocation } from "react-router-dom";
import { Context as AlertContext } from "contexts/AlertContext";
import { SocketContext } from "contexts/SocketContext";

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
    case "updateUser":
      return { user: action.payload.user, errorMessage: "" };
    case "becomeChef":
      return {
        ...state,
        user: {
          ...state.user,
          chefCuisine: action.payload.chefCuisine,
          isChef: true,
          mealItems: [action.payload.meal],
        },
      };
    case "createMeal":
      return {
        ...state,
        user: {
          ...state.user,
          isChef: true,
          mealItems: [action.payload.meal, ...state.user.mealItems],
        },
      };
    case "editMeal":
      return {
        ...state,
        user: {
          ...state.user,
          mealItems: state.user.mealItems.map((mealItem) =>
            mealItem.id !== action.payload.meal.id
              ? mealItem
              : action.payload.meal
          ),
        },
      };
    default:
      return state;
  }
};

const Context = React.createContext();

const Provider = ({ children }) => {
  const { alert } = useContext(AlertContext);
  const { socket } = useContext(SocketContext);

  const [state, dispatch] = useReducer(reducer, {
    user: null,
    errorMessage: "",
  });

  useEffect(() => {
    // Check if user is logged in on first visit to application
    refreshLoggedInUser("login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      socket.emit("user connected", data.user.id);
      history.push("/");
    } catch (error) {
      handleErrorResponse(error);
    }
  };
  const login = async ({ email, password }) => {
    try {
      const { data } = await API.post("/users/login", { email, password });
      dispatch({ type: "login", payload: { user: data.user } });
      socket.emit("user connected", data.user.id);
      let { from } = location.state || { from: { pathname: "/" } };
      history.replace(from);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(updatedUser)) {
        //Objects such as arrays need to be stringifed when sending as multipart/form-data
        if (key === "cuisines") formData.set(key, JSON.stringify(value));
        else formData.set(key, value);
      }

      const {
        data: { user },
      } = await API.put("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (user.profileImage) {
        const cacheBuster = Date.now();
        user.profileImage = `${user.profileImage}?${cacheBuster}`;
      }
      dispatch({ type: "updateUser", payload: { user } });
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const clearErrorMessage = () => dispatch({ type: "clearErrorMessage" });

  const signOut = async () => {
    try {
      await API.post("/users/logout");
      dispatch({ type: "signOut" });
      socket.emit("signOut");
      history.push("/login");
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const refreshLoggedInUser = async (action = "refresh") => {
    try {
      const { data } = await API.get("/users/login");
      dispatch({ type: "refreshUser", payload: { user: data.user } });
      socket.emit("user connected", data.user.id);
    } catch (error) {
      alert(`Unable to ${action} user`);
      return;
    }
  };

  const becomeChef = async (chefCuisineStr, firstMeal) => {
    try {
      const formData = new FormData();
      formData.set("chefCuisine", chefCuisineStr);
      for (const [key, value] of Object.entries(firstMeal)) {
        formData.set(key, value);
      }

      const {
        data: { meal, chefCuisine },
      } = await API.post("/chefs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch({ type: "becomeChef", payload: { meal, chefCuisine } });
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const createMeal = async (newMeal) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(newMeal)) {
        formData.set(key, value);
      }

      const {
        data: { meal },
      } = await API.post("/meal_items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch({ type: "createMeal", payload: { meal } });
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const editMeal = async (mealId, updatedMeal) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(updatedMeal)) {
        formData.set(key, value);
      }

      const {
        data: { meal },
      } = await API.put(`/meal_items/${mealId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (meal.image) {
        const cacheBuster = Date.now();
        meal.image = `${meal.image}?${cacheBuster}`;
      }

      dispatch({ type: "editMeal", payload: { meal } });
    } catch (error) {
      handleErrorResponse(error);
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
        becomeChef,
        createMeal,
        editMeal,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
