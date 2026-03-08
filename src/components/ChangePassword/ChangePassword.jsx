import React, { useContext, useState } from "react";
import { Input, Button, Card, CardHeader, CardBody } from "@heroui/react";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authContext } from "../Context/AuthContext";
import Swal from "sweetalert2";

const passwordSchema = zod.object({
  password: zod.string().nonempty("Current password is required"),
  newPassword: zod
    .string()
    .nonempty("New password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain uppercase, lowercase, number, and special character",
    ),
});

export default function ChangePassword() {
  const [isVisibleCurrent, setIsVisibleCurrent] = useState(false);
  const [isVisibleNew, setIsVisibleNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { token, logoutWithoutAlert } = useContext(authContext);

  const toggleVisibilityCurrent = () => setIsVisibleCurrent(!isVisibleCurrent);
  const toggleVisibilityNew = () => setIsVisibleNew(!isVisibleNew);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  // Watch the new password field for the strength bar
  const newPasswordValue = watch("newPassword", "");

  function handlePasswordChange(data) {
    setIsLoading(true);
    axios
      .patch("https://route-posts.routemisr.com/users/change-password", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password updated successfully",
          confirmButtonColor: "#4f46e5",
          timer: 2000,
          showConfirmButton: false,
        });
        reset(); // Clear the form
        logoutWithoutAlert();
      })
      .catch((err) => {
        const message =
          err.response?.data?.errors?.msg ||
          err.response?.data?.message ||
          "Something went wrong";
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
          confirmButtonColor: "#ef4444",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Simple visual logic for password strength (UI only)
  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 33;
    if (pass.length < 10) return 66;
    return 100;
  };

  const strength = getPasswordStrength(newPasswordValue);
  const strengthColor =
    strength <= 33
      ? "bg-red-500"
      : strength <= 66
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Change Password – Social</title>
      </Helmet>

      <Card className="w-full max-w-md bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        <CardHeader className="flex flex-col items-center pt-10 pb-4 px-8">
          <div className="bg-indigo-600/10 p-4 rounded-full mb-4">
            <MdLock className="text-3xl text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Change Password
          </h1>
          <p className="text-gray-400 text-center text-sm mt-2">
            Update your password to keep your account secure.
          </p>
        </CardHeader>

        <CardBody className="px-8 pb-10">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(handlePasswordChange)}
          >
            <div className="space-y-4">
              {/* Current Password Field */}
              <div className="space-y-1">
                <Input
                  {...register("password")}
                  label="Current Password"
                  placeholder="Enter your current password"
                  type={isVisibleCurrent ? "text" : "password"}
                  variant="bordered"
                  radius="lg"
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  classNames={{
                    label: "text-gray-400 font-medium",
                    input: "text-white",
                    inputWrapper:
                      "bg-gray-800/50 border-gray-700 hover:border-gray-600 focus-within:!border-indigo-600 transition-all",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityCurrent}
                    >
                      {isVisibleCurrent ? (
                        <MdVisibilityOff className="text-xl text-gray-400" />
                      ) : (
                        <MdVisibility className="text-xl text-gray-400" />
                      )}
                    </button>
                  }
                />
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <Input
                  {...register("newPassword")}
                  label="New Password"
                  placeholder="Enter your new password"
                  type={isVisibleNew ? "text" : "password"}
                  variant="bordered"
                  radius="lg"
                  isInvalid={!!errors.newPassword}
                  errorMessage={errors.newPassword?.message}
                  classNames={{
                    label: "text-gray-400 font-medium",
                    input: "text-white",
                    inputWrapper:
                      "bg-gray-800/50 border-gray-700 hover:border-gray-600 focus-within:!border-indigo-600 transition-all",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityNew}
                    >
                      {isVisibleNew ? (
                        <MdVisibilityOff className="text-xl text-gray-400" />
                      ) : (
                        <MdVisibility className="text-xl text-gray-400" />
                      )}
                    </button>
                  }
                />

                {/* Password Strength Indicator */}
                <div className="space-y-1.5 px-1 py-2">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    <span>Password Strength</span>
                    <span className={strength === 100 ? "text-green-500" : ""}>
                      {strength <= 33
                        ? "Weak"
                        : strength <= 66
                          ? "Fair"
                          : "Strong"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} transition-all duration-500 ease-out`}
                      style={{ width: `${strength}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 rounded-full shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                Update Password
              </Button>
              <Button
                as={Link}
                to="/profile"
                variant="bordered"
                isDisabled={isLoading}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 font-medium py-6 rounded-full transition-all"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
