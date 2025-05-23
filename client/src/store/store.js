
import { configureStore } from '@reduxjs/toolkit';
import  authReducer  from './slices/authSlice.js';
import popupReducer from './slices/popUpSlice.js';
import userReducer from './slices/userSlice.js';
import bookReducer from './slices/bookSlice.js'
import borroweReducer from './slices/borrowSlice.js'
export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth:authReducer,
        popup:popupReducer,
        user: userReducer,
        book:bookReducer,
        borrow:borroweReducer,
    },
    
});