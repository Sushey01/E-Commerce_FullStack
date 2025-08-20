import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const savedItems = JSON.parse(localStorage.getItem("cartlist")) || [];

const initialState = { items: savedItems.map(item => ({ ...item, quantity: 1 })) };

const cartlistSlice = createSlice({
  name: "cartlist",
  initialState,
  reducers: {
    addToCartlist: (state, action) => {
      const exists = state.items.find(item => item.title === action.payload.title);
      if (!exists) {
      state.items.push({ ...action.payload, quantity: 1 });
      }else {
        exists.quantity += 1;
      }
       localStorage.setItem("cartlist", JSON.stringify(state.items));
    },
    removeFromCartlist: (state, action) => {
      state.items = state.items.filter(item => item.title !== action.payload);
      localStorage.setItem("cartlist", JSON.stringify(state.items));
    },
  },
});

export const { addToCartlist, removeFromCartlist } = cartlistSlice.actions;
export default cartlistSlice.reducer;
