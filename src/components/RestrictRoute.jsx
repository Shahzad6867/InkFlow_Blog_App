import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthUser } from "../contexts/AuthContext";

function RestrictRoute({ children }) {
  const { user, loader } = useContext(AuthUser); 
  const origin = useLocation();
  console.log(user)
  
  if (loader) {
    return null;
  }

  if (user) {
    return <Navigate to={origin?.state?.path || "/home"} replace />;
  }

  return children;
}

export default RestrictRoute;
