import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { signupThunk, googleLoginThunk } from "../services/authThunk";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  // --- Email/password signup ---
  const create = async (data) => {
    setError("");
    try {
      const { user, token } = await dispatch(signupThunk(data)).unwrap();
      navigate("/");
      console.log("User signed up:", user, "Token:", token);
    } catch (err) {
      console.error("Error creating account:", err);
      setError(
        typeof err === "string" ? err : err.message || "Failed to create account"
      );
    }
  };

  // --- Google signup/login ---
  const signupWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // decode Google credential to get user info
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const decoded = await userInfoResponse.json();

        const googleUser = {
          googleId: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        };

        const { user } = await dispatch(googleLoginThunk(googleUser)).unwrap();
        console.log("Google user logged in:", user);
        navigate("/");
      } catch (err) {
        console.error("Google login failed:", err);
        setError(err.message || "Google login failed");
      }
    },
    onError: () => setError("Google login failed"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="mx-auto w-full max-w-lg bg-gray-100 dark:bg-gray-800 rounded-xl p-10 border border-black/10 dark:border-gray-700 shadow-lg transition-colors">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60 dark:text-gray-400">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary dark:text-blue-400 transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        {/* Email/Password Signup */}
        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("name", { required: true })}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be valid",
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
              Create Account
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <span className="h-px w-1/3 bg-gray-300 dark:bg-gray-600" />
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
          <span className="h-px w-1/3 bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Google Signup Button */}
        <Button
          onClick={() => signupWithGoogle()}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </Button>
      </div>
    </div>
  );
}

export default Signup;
