
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from "../features/wishlistSlice";
import cartlistReducer from "../features/cartlistSlice";


export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cartlist: cartlistReducer,
  },
});

export default store;
