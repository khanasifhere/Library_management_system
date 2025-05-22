import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { resetAuthSlice } from "../store/slices/authSlice.js";
import { login } from "../store/slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const { loading, error, message, user, isAuthenticated } =
    useSelector((state) => state.auth);
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
  }
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    // if (message) {
    //   toast.success(message);
    //   dispatch(resetAuthSlice());
    // }
    
  },[dispatch,isAuthenticated,loading,error]);
  if(isAuthenticated){
    return<Navigate to ={"/"} />
  }
  return <>
    <div className="flex flex-col justify-center md:flex-row h-screen">
         <div className="w-full md:w-1/2 bg-white  flex items-center justify-center p-8 relative">
         <div className="max-w-sm w-full">
          <div className="flex justify-center mb-12">
            <div className="rounded-full flex items-center justify-center ">
                 <img src={logo} alt="logo"
                 className="h-24 w-auto" /> 
            </div>
          </div>
          <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden"> Welcome Back !!</h1>
         <p className="text-gray-800 text-center mb-12">Please Enter Your Credentials to Log in </p>
         <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input type="email" 
            placeholder="Enter email" 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)}
            className="border border-black rounded-md w-full py-3 px-4 focus:outline-none "/>
          </div>
          <div className="mb-4">
            <input type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="border border-black rounded-md w-full py-3 px-4 focus:outline-none "/>
          </div>
          <Link to={"/password/forgot"} className="font-semibold text-black mb-12 hover:underline">Forgot Password?</Link>
            <div className="block md:hidden font-semibold mt-5">
              <p>
                New to our platform?
                <Link to={"/register"} className="font-semibold text-black hover:underline"> Sign Up</Link>
              </p>
            </div>
          <button type="submit" className="border-2 mt-5 border-black w-full font-semibold
           bg-black text-white py-2 rounded-lg hover:bg-white
           hover:text-black transition"> 
            SIGN IN</button>
                   
         </form>
         </div>
         </div>
  
  
         <div className="hidden w-ull md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[400px]">
            <div className="flex justify-center mb-12">
               <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto"/>
            </div>
            <p className="text-gray-300 mb-12 ">New to our platform? Sign Up now.</p>
            <Link to={"/register"} className="border-2 mt-5 border-white w-full font-semibold
           bg-black text-white py-2 rounded-lg hover:bg-white
           hover:text-black transition px-8"> SIGN UP</Link>
          </div>
         </div>
    </div>
    </>;
};

export default Login;
