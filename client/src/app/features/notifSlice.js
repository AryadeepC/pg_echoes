import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifs: 0,
};

export const notifSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    incrementNotif: (state) => {
      state.value += 1;
    },
    decrementNotif: (state) => {
      state.value -= 1;
    },
    incrementNotifByAmount: (state, action) => {
      state.value += action.payload;
    },
    decrementNotifByAmount: (state, action) => {
      state.value -= action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  incrementNotif,
  decrementNotif,
  incrementNotifByAmount,
  decrementNotifByAmount,
} = notifSlice.actions;

export default notifSlice.reducer;
