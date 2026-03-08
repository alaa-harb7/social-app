import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import AuthContext from "./components/Context/AuthContext";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import PublicRoutes from "./utils/PublicRoutes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PostDetails from "./components/PostDetails/PostDetails";
import { ToastContainer } from "react-toastify";
import MyProfile from "./components/MyProfile/MyProfile";
import ProfileUser from "./components/MyProfile/ProfileUser"
import FeedFilterContext from "./components/Context/FeedFilterContext";

import Discover from "./components/Discover/Discover";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import Notifications from "./components/Notifications/Notifications";
import { ThemeProvider } from "./context/ThemeContext";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          { index: true, element: <Home /> },
          { path: "feed", element: <Home /> },
          { path: "profile", element: <MyProfile /> },
          { path: "profile/:id", element: <ProfileUser /> },
          { path: "post/:id", element: <PostDetails /> },
          { path: "discover", element: <Discover /> },
          { path: "notifications", element: <Notifications /> },
          { path: "change-password", element: <ChangePassword /> },
        ],
      },
      {
        element: <PublicRoutes />,
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
        ],
      },
      {
        path: "*",
        element: (
          <div className="bg-gray-600 h-screen flex items-center justify-center">
            Not Found
          </div>
        ),
      },
    ],
  },
]);

export default function App() {
  const defaultQueryClient = new QueryClient();

  return (
    <QueryClientProvider client={defaultQueryClient}>
    <ThemeProvider>
    <AuthContext>
      <FeedFilterContext>
        <HeroUIProvider>
          <RouterProvider router={router} />;
        </HeroUIProvider>
      </FeedFilterContext>
    </AuthContext>
    </ThemeProvider>
    <ToastContainer/>
    </QueryClientProvider>

    
  );
}
