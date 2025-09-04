import { createSlice } from "@reduxjs/toolkit";
import { addToWishlist } from "./wishlistSlice";
import { ToastContainer, toast } from "react-toastify";

  
const savedItems = JSON.parse(localStorage.getItem("cartlist") || "[]");

const initialState = { 
  items: savedItems
};


const cartlistSlice = createSlice({
  name: "cartlist",
  initialState,
  reducers: {
    addToCartlist: (state, action) => {
      const payload = action.payload;

     const exists = state.items.find(
       (item) =>
         item.id === payload.id &&
         Object.keys(payload.variant || {}).every(
           (key) => (item.variant || {})[key] === payload.variant[key]
         )
     );
      if (exists) {
        exists.quantity += action.payload.quantity ;
      } else {
state.items.push({
  id: action.payload.id,
  name: action.payload.name,
  price: action.payload.price,
  image: action.payload.image,
  variations: action.payload.variations || {},
  quantity: action.payload.quantity ?? 1,
});
      }

      localStorage.setItem("cartlist", JSON.stringify(state.items));
      toast.success(`${action.payload.name} added to cart 🛒`);
    },


   removeFromCartlist: (state, action) => {
  const { id, style, capacity, color } = action.payload;

  state.items = state.items.filter(
    item =>
      !(
        item.id === id 
      )
  );

  localStorage.setItem("cartlist", JSON.stringify(state.items));
},


    updateQuantity: (state, action) => {
      const { id, style, capacity, color, change } = action.payload;
      const item = state.items.find(item =>
        item.id === id
      );
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
