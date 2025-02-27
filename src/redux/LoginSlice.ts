import { createSlice } from "@reduxjs/toolkit";
const loginSlice = createSlice({
  name: "authLogin",
  initialState: {
    token: JSON.parse(localStorage.getItem("userData")),
  },
  reducers: {
    logindone: (state, action) => {
      console.log(action.payload, "sachin");
      state.token = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    logOut: (state, action) => {
      localStorage.removeItem("userData");
      state.token = action.payload;
    },
  },
});
export const { logindone, logOut } = loginSlice.actions;
export default loginSlice.reducer;