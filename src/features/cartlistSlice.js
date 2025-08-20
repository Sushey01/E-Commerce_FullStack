import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const savedItems = [];

//alternative way to give unique id
//product passed from monthlycard and inside product added unique id
// const handleAddToCart = (product)=>{
//     const itemWithId ={...product, id:Date.now()} //unique id  
//     dispatch(addToCartlist(itemWithId))
// }

const initialState = { items: savedItems.map(item => ({ ...item, quantity: 1 })) };

const cartlistSlice = createSlice({
  name: "cartlist",
  initialState,
  reducers: {
    addToCartlist: (state, action) => {
      const exists = state.items.find(item => item.title === action.payload.title);
      if (!exists) {
      state.items.push({ ...action.payload, id:Date.now(), quantity: 1 }); // added id:Date.now for auto generate id 
      }else {
        exists.quantity += 1;
      }
       localStorage.setItem("cartlist", JSON.stringify(state.items));
    },
    removeFromCartlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem("cartlist", JSON.stringify(state.items));
    },
  },
});

export const { addToCartlist, removeFromCartlist } = cartlistSlice.actions;
export default cartlistSlice.reducer;
