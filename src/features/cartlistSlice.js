import { createSlice } from "@reduxjs/toolkit";
  
const savedItems = JSON.parse(localStorage.getItem("cartlist") || "[]");

const initialState = { 
  items: Array.isArray(savedItems)
    ? savedItems.map(item => ({ ...item, quantity: item.quantity ?? 1 }))
    : []
};


const cartlistSlice = createSlice({
  name: "cartlist",
  initialState,
  reducers: {
    addToCartlist: (state, action) => {
      const { id, style, capacity, color } = action.payload;

      // Check if this exact variant exists
      const exists = state.items.find(item => 
        item.id === id &&
        item.style === style &&
        item.capacity === capacity &&
        item.color === color
      );

      if (exists) {
        exists.quantity += action.payload.quantity ?? 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity ?? 1 });
      }

      localStorage.setItem("cartlist", JSON.stringify(state.items));
      // toast.success(`${action.payload.name} added to cart 🛒`);
    },

   removeFromCartlist: (state, action) => {
  const { id, style, capacity, color } = action.payload;

  state.items = state.items.filter(
    item =>
      item.id !== id ||
      item.style !== style ||
      item.capacity !== capacity ||
      item.color !== color
  );

  localStorage.setItem("cartlist", JSON.stringify(state.items));
},


    updateQuantity: (state, action) => {
      const { id, style, capacity, color, change } = action.payload;
      const item = state.items.find(item =>
        item.id === id &&
        item.style === style &&
        item.capacity === capacity &&
        item.color === color
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
