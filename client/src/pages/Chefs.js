import React from "react";
import ChefSearch from "components/ChefSearch";
import LoginForm from "components/LoginForm";
import Navbar from "components/Navbar"

const Chefs = ({ props }) => {
  return (
    <>
      <Navbar/>
      <ChefSearch
      />
    </>
    
  );
};

export default Chefs;


