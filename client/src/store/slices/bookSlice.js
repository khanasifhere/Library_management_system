import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopUp } from "./popUpSlice.js";
const bookSlice=createSlice(
    {
        name:"book",
        initialState:{
            loading:false,
            error:null,
            message:null,
            books:[],
        },
        reducers:{
           fetchBooksRequest: (state) => {
                state.loading = true;
                state.error = null;
                state.message=null;
            },
            fetchBooksSuccess: (state, action) => {
                state.loading = false;
                state.books = action.payload;
            },
            fetchBooksFail: (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message=null;
            },
             addBookRequest: (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            },
            addBookSuccess: (state, action) => {
                state.loading = false;
                state.message = action.payload;
            },
            addBookFail: (state, action) => {
                state.loading = false;
                state.error = action.payload;
            },
            resetBookSlice: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            },
        }
    }
)
export const fetchAllBooks = () => async (dispatch) => {
    
        dispatch(bookSlice.actions.fetchBooksRequest());
         await axios
         .get("https://library-management-system-jhmt.onrender.com/api/v1/book/all",{withCredentials:true})
         .then(res=>{ dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books))})
         .catch(err=>{dispatch(bookSlice.actions.fetchBooksFail(err.response.data.message))
        })
    
};
export const addBook = (formData) => async (dispatch) => {
    dispatch(bookSlice.actions.addBookRequest());
    await axios
        .post("https://library-management-system-jhmt.onrender.com/api/v1/book/admin/add", formData, { withCredentials: true ,headers:{"Content-Type":"application/json"}})
        .then(res => {
            dispatch(bookSlice.actions.addBookSuccess(res.data.message));
            dispatch(toggleAddBookPopUp())
        })
        .catch(err => {
            dispatch(bookSlice.actions.addBookFail(err.response.data.message));
        });
};
export const resetBookSlice=()=>(dispatch)=>{
    dispatch(bookSlice.actions.resetBookSlice())
}
export default bookSlice.reducer;
