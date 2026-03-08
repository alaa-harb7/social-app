import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";

import image from "../../assets/vector.png";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authContext } from "../Context/AuthContext";
import { Helmet } from "react-helmet";

const registerSchema = zod.object({
  email: zod.email("Email is invalid"),
  password: zod
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  // )
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const { handleToken } = useContext(authContext);

  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({ resolver: zodResolver(registerSchema), mode: "onBlur" });

  const myHandleSubmit = (values) => {
    console.log(values);

    setIsLoading(true);

    axios
      .post("https://route-posts.routemisr.com/users/signin", values)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Login successfully",
          text: "You will be redirected to Home page",
          confirmButtonColor: "#4f46e5",
          timer: 2000,
          showConfirmButton: false,
        });
        // console.log(res.data.data.token);
        handleToken(res.data.data.token);
        localStorage.setItem("token", res.data.data.token);
        navigate("/home");
      })
      .catch((err) => {
        console.log(err.response.data.error);
        const message = err.response?.data?.error || "Something went wrong";

        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: message,
          confirmButtonColor: "#ef4444",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="grid lg:grid-cols-2 sm:grid-cols-1 min-h-screen items-center">

      <Helmet>
        <title>Login Page</title>
      </Helmet>
      
      {/* Left Side – Register Form */}
      <div className="register-from max-w-md mx-auto text-center border border-indigo-700 rounded-2xl p-10">
        <h2 className="text-indigo-700 font-bold mb-8 text-2xl">
          Login to your account
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit(myHandleSubmit)}
          className="register-form flex flex-col gap-2 min-h-60 justify-center"
        >
          <div>
            <input
              {...register("email")}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
              type="email"
              placeholder="Email"
            />
            {errors.email && touchedFields.email && (
              <p className="text-sm text-left text-red-500">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("password")}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
              type="password"
              placeholder="Password"
            />
            {errors.password && touchedFields.password && (
              <p className="text-sm text-left text-red-500">
                {errors.password?.message}
              </p>
            )}
          </div>
          {/* Submit */}

          <button
            className="bg-indigo-700 mt-6 hover:bg-indigo-800 transition rounded-full py-2 px-8 text-white text-sm font-medium"
            type="submit"
          >
            {isLoading ? (
              <PulseLoader color="#fff" loading size={5} />
            ) : (
              "Login"
            )}
          </button>
          <p className="text-left text-sm text-red-500">
            {errors.terms?.message}
          </p>
        </form>
      </div>

      {/* Right Side – Info */}
      <div className="right-bar hidden lg:flex text-center flex-col justify-center px-10">
        <h3 className="text-3xl font-bold text-indigo-700 mb-5">
          Lorem ipsum dolor sit
        </h3>
        <p className="text-xl text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam,
          aspernatur.
        </p>

        <div className="flex justify-center mt-14">
          <img
            className="w-80 animate-bounce [animation-duration:3s]"
            src={image}
            alt="illustration"
          />
        </div>
      </div>
    </div>
  );
}
