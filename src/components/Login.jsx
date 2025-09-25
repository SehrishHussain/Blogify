import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser } from "../services/authThunk";
import { authService } from "../services"; // still used for Google login (unless you add a thunk later)

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  // Email/password login (via thunk)
  const login = async (data) => {
    setError("");
    try {
      const result = await dispatch(
        loginUser({ email: data.email, password: data.password })
      ).unwrap();

      if (result) {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login");
    }
  };

  // Google OAuth login (direct for now)
  const loginWithGoogle = async () => {
    try {
      authService.loginWithGoogle(); // 🔹 Can later wrap this in a thunk too
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="mx-auto w-full max-w-lg bg-[#fdfcdc] dark:bg-gray-800 rounded-xl p-10 border border-black/10 dark:border-gray-700 shadow-lg transition-colors">
        {/* Logo */}
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60 dark:text-gray-400">
          <Link
            to="/signup"
            className="font-medium text-primary dark:text-blue-400 transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Error */}
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <span className="h-px w-1/3 bg-gray-300 dark:bg-gray-600" />
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
          <span className="h-px w-1/3 bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Google Auth */}
        <Button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
