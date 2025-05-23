import React, { useState,useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useSelector,useDispatch } from "react-redux";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";
const ResetPassword = () => {
  const [password,setPassword]=useState("");
  const {token}=useParams();
  const [confirmPassword,setConfirmPassword]=useState("");
  const dispatch=useDispatch();
   
 const { loading, error, message, user, isAuthenticated } =
     useSelector((state) => state.auth);
     //generate forgot password email function
     const handleResetPassword=(e)=>{
      e.preventDefault();
      const data=new FormData();
      data.append("password",password)
      data.append("confirmPassword",confirmPassword)
      dispatch(resetPassword({token,data}))
     }
     useEffect(() => {
         if (error) {
           toast.error(error);
           dispatch(resetAuthSlice());
         }
         if (message) {
           toast.success(message);
           dispatch(resetAuthSlice());
         }
       }, [dispatch, isAuthenticated, loading, error]);
       if (isAuthenticated) {
         return <Navigate to={"/"} />;
       }
     




  
  
  return <>
  <div className="flex flex-col justify-center md:flex-row h-screen">

  <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounder-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[450px]">
                   <div className="flex justify-center mb-12">
                          <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto " />
                   </div>
                   <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium leading-10">"Your Premier digital library for borrowing and reading books"</h3>
              </div>
  </div>


   <div className="w-full md:w-1/2 bg-white  flex items-center justify-center p-8 relative">
                      <Link to={"/password/forgot"} className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end ">Back</Link>
           <div className="max-w-sm w-full">
                 <div className="flex justify-center mb-12">
                    <div className="rounded-full flex items-center justify-center ">
                         <img src={logo} alt="logo"
                         className="h-24 w-auto" /> 
                    </div>
  
                 </div>
                  <h1 className="text-4xl font-medium text-center mb-5 overflow-hidden"> Reset Password</h1>
           <p className="text-gray-800 text-center mb-12"> Please Enter your new Password</p>
           <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <input type="password" 
              required
              placeholder="Enter password"
              value={password} 
              onChange={(e)=>setPassword(e.target.value)}
              className="border border-black rounded-md w-full py-3 px-4 focus:outline-none "/>
            </div>
            <div className="mb-4">
              <input type="password" 
              required
              placeholder="Confirm password"
              value={confirmPassword} 
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="border border-black rounded-md w-full py-3 px-4 focus:outline-none "/>
            </div>
            <button type="submit" className="border-2 mt-5 border-black w-full font-semibold
             bg-black text-white py-2 rounded-lg hover:bg-white
             hover:text-black transition"
             disabled={loading? true : false}> 
              RESET PASSWORD</button>
            </form>
           
           
           </div>
    </div>
  </div>
  </>;
};

export default ResetPassword;
