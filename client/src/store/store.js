
import { configureStore } from '@reduxjs/toolkit';
import  authReducer  from './slices/authSlice.js';
import popupReducer from './slices/popUpSlice.js';
export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth:authReducer,
        popup:popupReducer,
    },
    
});