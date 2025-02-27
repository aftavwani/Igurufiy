import { configureStore } from "@reduxjs/toolkit";
import loginslice from "./redux/LoginSlice";

export const store = configureStore({
  reducer: {
    authLogin: loginslice,
  },
});

export default store;
