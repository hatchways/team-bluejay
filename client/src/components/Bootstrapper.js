import React, { useContext, useEffect } from "react";
import { Context as AuthContext } from "contexts/AuthContext";

const Bootstrapper = ({ children }) => {
  const { refreshLoggedInUser } = useContext(AuthContext);
  useEffect(() => {
    refreshLoggedInUser();
  }, []);
  return <>{children}</>;
};

export default Bootstrapper;
