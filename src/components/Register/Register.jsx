import { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";

import image from "../../assets/vector.png";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const registerSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    email: zod.email("Email is invalid"),
    password: zod
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    rePassword: zod
      .string()
      .nonempty("Confirm Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    dateOfBirth: zod.coerce
      .date()
      .refine((value) => {
        return new Date().getFullYear() - value.getFullYear() >= 18;
      }, "Age must be at least 18")
      .transform(
        (value) =>
          `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`,
      ),
    gender: zod.enum(["male", "female"]),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

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
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Account created successfully",
          text: "You will be redirected to login page",
          confirmButtonColor: "#4f46e5",
          timer: 2000,
          showConfirmButton: false,
        });
        console.log(res);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.error || "Something went wrong";

        Swal.fire({
          icon: "error",
          title: "Registration failed",
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
      {/* Left Side – Register Form */}
      <div className="register-from max-w-md mx-auto text-center border border-indigo-700 rounded-2xl p-10">
        <h2 className="text-indigo-700 font-bold mb-8 text-2xl">
          Create your free account
        </h2>

        {/* Social Login */}
        <div className="social-icons flex items-center justify-center gap-4 mb-8">
          <div className="flex justify-center rounded-md items-center gap-2 w-36 h-10 bg-indigo-600 text-white shadow-sm cursor-pointer">
            <FaFacebookF />
            <span className="text-sm font-medium">Facebook</span>
          </div>

          <div className="flex justify-center rounded-md items-center gap-2 w-36 h-10 bg-sky-400 text-white shadow-sm cursor-pointer">
            <FaTwitter />
            <span className="text-sm font-medium">Twitter</span>
          </div>

          <div className="flex justify-center rounded-md items-center gap-2 w-36 h-10 bg-red-600 text-white shadow-sm cursor-pointer">
            <FaGoogle />
            <span className="text-sm font-medium">Google</span>
          </div>
        </div>

        <p className="text-gray-400 mb-6 text-sm">Or register with email</p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(myHandleSubmit)}
          className="register-form flex flex-col gap-2"
        >
          <div>
            <input
              {...register("name")}
              className="w-full p-3 border-2  border-gray-300 rounded-xl  focus:outline-none focus:border-indigo-500"
              type="text"
              placeholder="Name"
            />
            {errors.name && touchedFields.name && (
              <p className="text-sm text-left text-red-500">
                {errors.name?.message}
              </p>
            )}
          </div>

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
          {/* Date of Birth */}

          <div className="mb-3 text-left">
            <label className="text-sm text-gray-600 mb-1 block">
              Date of birth
            </label>
            <input
              {...register("dateOfBirth")}
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:border-indigo-500"
              type="date"
            />
            {errors.dateOfBirth && touchedFields.dateOfBirth && (
              <p className="text-sm text-left text-red-500">
                {errors.dateOfBirth?.message}
              </p>
            )}
          </div>

          {/* Gender */}

          <div className="mb-4 text-left">
            <p className="text-sm text-gray-600 mb-2 font-medium">Gender</p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("gender")}
                  value="male"
                  type="radio"
                  name="gender"
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm">Male</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("gender")}
                  value="female"
                  type="radio"
                  name="gender"
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm">Female</span>
              </label>
            </div>
            <p className="text-sm text-left text-red-500">
              {errors.gender?.message}
            </p>
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
          <div>
            <input
              {...register("rePassword")}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
              type="password"
              placeholder="Confirm password"
            />
            {errors.rePassword && touchedFields.rePassword && (
              <p className="text-sm text-left text-red-500">
                {errors.rePassword?.message}
              </p>
            )}
          </div>
          {/* Submit */}
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                className="w-4 h-4 accent-indigo-600"
                type="checkbox"
                {...register("terms")}
              />
              I agree to terms & conditions
            </label>

            <button
              className="bg-indigo-700 hover:bg-indigo-800 transition rounded-full py-2 px-8 text-white text-sm font-medium"
              type="submit"
            >
              {isLoading ? (
                <PulseLoader color="#fff" loading size={5} />
              ) : (
                "Submit"
              )}
            </button>
          </div>
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

// Validaion using React-Hook-Form

// export default function Register() {
//   const {
//     handleSubmit,
//     register,
//     getValues,
//     setError,
//     formState: { errors, touchedFields },
//   } = useForm({ mode: "onBlur" });
//   const myHandleSubmit = (values) => {
//     console.log(values);

//     if(values.password === values.rePassword ){
//       console.log("password match");
//     }else{
//       console.log("password not match");
//       setError('rePassword', {message: "conformation password not match"})
//     }
//   };

//   return (
//     <div className="grid lg:grid-cols-2 sm:grid-cols-1 min-h-screen items-center">
//       {/* Left Side – Register Form */}
//       <div className="register-from max-w-md mx-auto text-center border border-indigo-700 rounded-2xl p-10">
//         <h2 className="text-indigo-700 font-bold mb-8 text-2xl">
//           Create your free account
//         </h2>

//         {/* Social Login */}
//         <div className="social-icons flex items-center justify-center gap-4 mb-8">
//           <div className="flex justify-center rounded-md items-center gap-2 w-36 h-10 bg-indigo-600 text-white shadow-sm cursor-pointer">
//             <FaFacebookF />
//             <span className="text-sm font-medium">Facebook</span>
//           </div>

//           <div className="flex justify-center rounded-md items-center gap-2 w-36 h-10 bg-sky-400 text-white shadow-sm cursor-pointer">
//             <FaTwitter />
//             <span className="text-sm font-medium">Twitter</span>
//           </div>

//           <div className="flex justify-center rounded-md items-center gap-2 w-36 h-10 bg-red-600 text-white shadow-sm cursor-pointer">
//             <FaGoogle />
//             <span className="text-sm font-medium">Google</span>
//           </div>
//         </div>

//         <p className="text-gray-400 mb-6 text-sm">Or register with email</p>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit(myHandleSubmit)}
//           className="register-form flex flex-col gap-2"
//         >
//           <div>
//             <input
//               {...register("name", {
//                 required: { value: true, message: "Name is required" },
//                 maxLength: {
//                   value: 20,
//                   message: "Name must be less than 20 characters",
//                 },
//                 minLength: {
//                   value: 2,
//                   message: "Name must be at least 2 characters",
//                 },
//               })}
//               className="w-full p-3 border-2  border-gray-300 rounded-xl  focus:outline-none focus:border-indigo-500"
//               type="text"
//               placeholder="Name"
//             />
//             {errors.name && touchedFields.name && (
//               <p className="text-sm text-left text-red-500">
//                 {errors.name?.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <input
//               {...register("email", {
//                 required: { value: true, message: "Email is required" },
//                 pattern: {
//                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                   message: "Invalid email address",
//                 },
//               })}
//               className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
//               type="email"
//               placeholder="Email"
//             />
//             {errors.email && touchedFields.email && (
//               <p className="text-sm text-left text-red-500">
//                 {errors.email?.message}
//               </p>
//             )}
//           </div>
//           {/* Date of Birth */}

//           <div className="mb-3 text-left">
//             <label className="text-sm text-gray-600 mb-1 block">
//               Date of birth
//             </label>
//             <input
//               {...register("dateOfBirth", {
//                 required: {
//                   value: true,
//                   message: "Date of birth is required",
//                 },
//                 valueAsDate: true,
//               })}
//               className="w-full p-3 border-2 border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:border-indigo-500"
//               type="date"
//             />
//             {errors.dateOfBirth && touchedFields.dateOfBirth && (
//               <p className="text-sm text-left text-red-500">
//                 {errors.dateOfBirth?.message}
//               </p>
//             )}
//           </div>

//           {/* Gender */}

//           <div className="mb-4 text-left">
//             <p className="text-sm text-gray-600 mb-2 font-medium">Gender</p>
//             <div className="flex items-center gap-6">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   {...register("gender", {
//                     required: { value: true, message: "Gender is required" },
//                   })}
//                   value="male"
//                   type="radio"
//                   name="gender"
//                   className="accent-indigo-600 w-4 h-4"
//                 />
//                 <span className="text-sm">Male</span>
//               </label>

//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   {...register("gender")}
//                   value="female"
//                   type="radio"
//                   name="gender"
//                   className="accent-indigo-600 w-4 h-4"
//                 />
//                 <span className="text-sm">Female</span>
//               </label>
//             </div>
//             <p className="text-sm text-left text-red-500">
//               {errors.gender?.message}
//             </p>
//           </div>
//           <div>
//             <input
//               {...register("password", {
//                 required: { value: true, message: "Password is required" },
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters",
//                 },
//               })}
//               className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
//               type="password"
//               placeholder="Password"
//             />
//             {errors.password && touchedFields.password && (
//               <p className="text-sm text-left text-red-500">
//                 {errors.password?.message}
//               </p>
//             )}
//           </div>
//           <div>
//             <input
//               {...register("rePassword", {
//                 required: {
//                   value: true,
//                   message: "Confirm Password is required",
//                 },
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters",
//                 },
//                 // validate: (value) => {
//                 //   const { password } = getValues();
//                 //   return value === password || "Passwords do not match";
//                 // },
//               })}
//               className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
//               type="password"
//               placeholder="Confirm password"
//             />
//             {errors.rePassword && touchedFields.rePassword && (
//               <p className="text-sm text-left text-red-500">
//                 {errors.rePassword?.message}
//               </p>
//             )}
//           </div>
//           {/* Submit */}
//           <div className="flex items-center justify-between mt-4">
//             <label className="flex items-center gap-2 text-sm cursor-pointer">
//               <input
//                 className="w-4 h-4 accent-indigo-600"
//                 type="checkbox"
//                 {...register("terms", {
//                   required: {
//                     value: true,
//                     message: "You must agree to terms & conditions",
//                   },
//                 })}
//               />
//               I agree to terms & conditions
//             </label>

//             <button
//               className="bg-indigo-700 hover:bg-indigo-800 transition rounded-full py-2 px-8 text-white text-sm font-medium"
//               type="submit"
//             >
//               Submit
//             </button>
//           </div>
//           <p className="text-left text-sm text-red-500">
//             {errors.terms?.message}
//           </p>
//         </form>
//       </div>

//       {/* Right Side – Info */}
//       <div className="right-bar hidden lg:flex text-center flex-col justify-center px-10">
//         <h3 className="text-3xl font-bold text-indigo-700 mb-5">
//           Lorem ipsum dolor sit
//         </h3>
//         <p className="text-xl text-gray-600 leading-relaxed">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam,
//           aspernatur.
//         </p>

//         <div className="flex justify-center mt-10">
//           <img className="w-80 animate-bounce" src={image} alt="illustration" />
//         </div>
//       </div>
//     </div>
//   );
// }
