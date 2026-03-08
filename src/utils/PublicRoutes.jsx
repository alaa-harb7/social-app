import React, { useContext } from 'react'
import { authContext } from '../components/Context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoutes() {

  const { token } = useContext(authContext);

  return token ? <Navigate to="/" replace /> : <Outlet />
}
