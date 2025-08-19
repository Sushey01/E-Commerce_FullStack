// store/wishlistSlice.js
import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    items: [], // wishlist items
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers:{
        addToWishlist: (state, action) => {
            // Avoid duplicates
            const exists = state.items.find(item => item.title === action.payload.title);
            if (!exists) state.items.push(action.payload);
        },
        removeFromWishlist: (state, action)=>{
            state.items = state.items.filter(item =>item.title !==action.payload);
        }
    }
});
export const {addToWishlist, removeFromWishlist} = wishlistSlice.actions;
export default wishlistSlice.reducer;