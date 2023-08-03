import { configureStore } from "@reduxjs/toolkit";
import notifReducer from "./features/notifSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notifReducer,
  },
});
