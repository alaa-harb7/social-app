import { createContext, use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const authContext = createContext();

export default function AuthContext({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate;
  console.log(`token: ${token}`);

  const handleToken = (token) => {
    setToken(token);
  };

    function getUserProfileData() {
    return axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      console.log(res.data.data.user);
      setUser(res.data.data.user);
    })
  }


  function decodeUserToken() {
    const decodedToken = jwtDecode(token);
    // console.log(`decodedToken: ${decodedToken.user}`);
    setUserId(decodedToken.user);
  }

  useEffect(() => {
    if (token) {
      decodeUserToken();
      getUserProfileData();
    }
  }, [token]);

  const logout = () => {
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to logout?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Logout successfully", "", "success");
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
      }
    });
  };


  const logoutWithoutAlert = () => {
  localStorage.removeItem("token");
  setToken(null);
};


  return (
    <authContext.Provider value={{ token, handleToken, logout, userId, logoutWithoutAlert, user}}>
      {children}
    </authContext.Provider>
  );
}
