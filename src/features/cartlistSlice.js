import { createSlice } from "@reduxjs/toolkit";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

const savedItems = [];

//alternative way to give unique id
//product passed from monthlycard and inside product added unique id
// const handleAddToCart = (product)=>{
//     const itemWithId ={...product, id:Date.now()} //unique id  
//     dispatch(addToCartlist(itemWithId))
// }

const initialState = { items: savedItems.map(item => ({ ...item, quantity: item.quantity ?? 1 })) };

const cartlistSlice = createSlice({
  name: "cartlist",
  initialState,
  reducers: {
addToCartlist: (state, action) => {
  const exists = state.items.find(item => item.id === action.payload.id);

  if (exists) {
    exists.quantity += 1;
  } else {
    state.items.push({ ...action.payload, quantity: 1 });
  }

  localStorage.setItem("cartlist", JSON.stringify(state.items));
  // toast.success(`${action.payload.name} added to cart 🛒`);
},


    removeFromCartlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem("cartlist", JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, change } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, (item.quantity ?? 1) + change);
      }
      localStorage.setItem("cartlist", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cartlist", JSON.stringify(state.items));
    },
  },
});

export const { addToCartlist, removeFromCartlist, updateQuantity, clearCart } = cartlistSlice.actions;
export default cartlistSlice.reducer;
