import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { use } from "react";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopUp } from "./popUpSlice.js";
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
   
    users: [],
  },
  reducers: {
    fetchAllUsersRequest: (state) => {
        state.loading = true;
        },
    fetchAllUsersSuccess: (state, action) => {
        state.loading = false;
        state.users = action.payload;
        },
    fetchAllUsersFail: (state, action) => {
        state.loading = false;
        
        },
        addNewAdminRequest: (state) => {
        state.loading = true;
        },
        addNewAdminSuccess: (state, action) => {
        state.loading = false;
        
        }   ,
        addNewAdminFail: (state, action) => {
        state.loading = false;
        },
  },
});
export const fetchAllUsers=() => async (dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  await axios.get("https://library-management-system-jhmt.onrender.com/api/v1/user/all", {
    withCredentials: true,
  })
    .then((res) => {
      dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
    })
    .catch((err) => {
      dispatch(userSlice.actions.fetchAllUsersFail(err.response.data.message));
    });
}
export const addNewAdmin=(data)=>async (dispatch)=>{
    dispatch(userSlice.actions.addNewAdminRequest());
    await axios.post("https://library-management-system-jhmt.onrender.com/api/v1/user/add/new-admin",data, {
        withCredentials: true,
        headers: {
        "Content-Type": "multipart/form-data",
        },
    })
        .then((res) => {
        dispatch(userSlice.actions.addNewAdminSuccess());
        toast.success(res.data.message);
        dispatch(toggleAddNewAdminPopUp())
        })
        .catch((err) => {
        dispatch(userSlice.actions.addNewAdminFail());
        toast.error(err.response.data.message);
        });
    }
export default userSlice.reducer;