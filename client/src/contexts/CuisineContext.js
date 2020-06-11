import React, { useState, useEffect } from "react";
import API from "api";

const CuisineContext = React.createContext();

const CuisineProvider = ({ children }) => {
  useEffect(() => {
    (async function getCuisines() {
      const { data: allCuisines } = await API.get("/cuisines");
      setCuisines(allCuisines);
    })();
  }, []);

  const [availableCuisines, setCuisines] = useState([]);

  return (
    <CuisineContext.Provider value={{ availableCuisines }}>
      {children}
    </CuisineContext.Provider>
  );
};

export { CuisineProvider, CuisineContext };
