import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { session } = UserAuth();

  // is session is true, then we can go to the children routes. If not, navigate to sign up page
  return <>{session ? <>{children}</> : <Navigate to="/signup" />}</>;
};

export default ProtectedRoute;
