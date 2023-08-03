import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setNoUser: (state) => {
      state.user = "";
    },
    setLoggedUser: (state, action) => {
      // console.log("what", action);
      // console.log("which", typeof action);
      state.user = action.payload;
    },
  },
});

export const { setNoUser, setLoggedUser } = authSlice.actions;

export default authSlice.reducer;
