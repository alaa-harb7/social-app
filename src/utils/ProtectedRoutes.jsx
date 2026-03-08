import React, { useContext } from "react";
import { authContext } from "../components/Context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const { token } = useContext(authContext);


  return token ? <Outlet /> : <Navigate to="/login" replace />;

}
