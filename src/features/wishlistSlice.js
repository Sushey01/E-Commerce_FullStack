import { createSlice } from "@reduxjs/toolkit";
import { addToCartlist } from "./cartlistSlice";
import { toast, ToastContainer } from "react-toastify";

const savedItems = JSON.parse(localStorage.getItem("wishlist")) || [];

const initialState = { items: savedItems.map(item => ({
  ...item,
  id: item.id || Date.now() + Math.random() // stable id if missing
}))};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(item => item.title === action.payload.title);
      if (!exists) {
        const newItem = { ...action.payload, id: Date.now() + Math.random() };
        state.items.push(newItem);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.items));
      toast.success(`${action.payload.name} added to wishlist 🛒`);
    },

    addToCartlist: (state, action)=>{
      const exists = state.items.find(item=>item.title===action.payload.title);
      if (!exists){
        const newItem = {...action.payload, id:Date.now()+Math.random()};
        state.items.push(newItem);
      }
      localStorage.setItem("cartlist", JSON.stringify(state.items))
    },
    
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
