import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthUser } from "../contexts/AuthContext";

function ProtectRoute({ children }) {
  const { user, loader } = useContext(AuthUser); 
  const location = useLocation();

  if (loader) {
    return null; 
  }


  if (!user && location.pathname !== "/" ) {
    return <Navigate to="/login" state={{ path: location.pathname }} replace />;
  } 

  return children;
}

export default ProtectRoute;
