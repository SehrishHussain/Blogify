// services/mock/authThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import mockAuthService from "./mock/mockAuthService";
import { login as loginAction, logout as logoutAction } from "../store/authSlice";
//import mockAuthService from "./mock/mockAuthService";


export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await mockAuthService.createAccount(formData);

      // res should look like { user, token }
      dispatch(loginAction(res.user)); // ✅ save user into Redux

      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { dispatch }) => {
    const data = await mockAuthService.login(email, password); // 👈 use service
    dispatch(loginAction(data.user));
    return data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    await mockAuthService.logout(); // 👈 use service
    dispatch(logoutAction());
  }
);

export const hydrateUser = createAsyncThunk(
  "auth/hydrateUser",
  async (_, { dispatch }) => {
    const data = await mockAuthService.getCurrentUser(); // 👈 use service
    if (data) {
      dispatch(loginAction(data.user));
    }
    return data;
  }
);
