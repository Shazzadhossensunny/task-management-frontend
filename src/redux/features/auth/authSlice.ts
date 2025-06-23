import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// User type based on JWT payload
export interface TUser {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

// User profile type (from backend)
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

// Auth state type
export interface TAuth {
  user: UserProfile | null;
  email: null | string;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: TAuth = {
  user: null,
  email: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log(state, action);
      const { user, email, token } = action.payload;
      state.token = token;
      state.user = user;
      state.email = email;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUserPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.points = action.payload;
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.email = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const {
  setUser,
  setLoading,
  updateUserPoints,
  updateUserProfile,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
