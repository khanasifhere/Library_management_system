import React from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { resetAuthSlice } from "../store/slices/authSlice";
import { toggleAddNewAdminPopUp, toggleSettingPopUp } from "../store/slices/popUpSlice.js";
import AddNewAdmin from "../popups/AddNewAdmin.jsx";
import SettingPopup from "../popups/SettingPopup.jsx"
import { logout } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";
import { useState } from "react";
import {Navigate,Link} from "react-router-dom"
const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
 const dispatch = useDispatch();
  const { user, 
        loading,
        error,
        message,
        isAuthenticated } = useSelector((state) => state.auth);
  const {addNewAdminPopUp,settingPopUp} = useSelector((state) => state.popup);
  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if(message){
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  },[dispatch,isAuthenticated,loading,error,message]);
  

  return (
    <>
    <aside style={{position:"fixed"}} className={`${isSideBarOpen?"left-0":"-left-full"} z-10 duration-700 transition-all md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full`}>
        <div className="px-6 py-4 my-8">
            <img src={logo_with_title} alt="Logo"  />
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button onClick={()=>setSelectedComponent("Dashboard")} className="w-full py-2 font-medium bg-transparent rounded-md  hover:cursor-pointer flex items-center space-x-2">
            <img src={dashboardIcon} alt="icon" />
            <span>
              DashBoard
            </span>
          </button>
          <button onClick={()=>setSelectedComponent("Books")} className="w-full py-2 font-medium bg-transparent rounded-md  hover:cursor-pointer flex items-center space-x-2">
            <img src={bookIcon} alt="icon" />
            <span>
              Books
            </span>
          </button>
          {isAuthenticated && user?.role==="admin" && (<>
          <button onClick={()=>setSelectedComponent("Catalog")} className="w-full py-2 font-medium bg-transparent rounded-md  hover:cursor-pointer flex items-center space-x-2">
            <img src={catalogIcon} alt="icon" />
            <span>
              Catalog
            </span>
          </button>
          <button onClick={()=>setSelectedComponent("Users")} className="w-full py-2 font-medium bg-transparent rounded-md  hover:cursor-pointer flex items-center space-x-2">
            <img src={usersIcon} alt="icon" />
            <span>
              Users
            </span>
          </button>
          <button 
           onClick={()=>dispatch(toggleAddNewAdminPopUp())}
           className="w-full py-2 font-medium bg-transparent rounded-md  hover:cursor-pointer flex items-center space-x-2">
            
            <RiAdminFill className="w-6 h-6"/>
            <span>Add New admin</span>
          </button>
          </>
          )}
            {
              isAuthenticated && user?.role==="user" && (<>
              <button onClick={()=>setSelectedComponent("My Borrowed Books")} className="w-full py-2 font-medium bg-transparent rounded-md  hover:cursor-pointer flex items-center space-x-2">
                <img src={bookIcon} alt="icon" />
                <span>
                  My Borrowed Books
                </span> 
              </button>
              </>
              )
            }
            <button onClick={()=>dispatch(toggleSettingPopUp())}  className="md:hidden w-full py-2 font-medium bg-transparent rounded-md  hover:cursor-pointer flex items-center space-x-2">
              <img src={settingIcon} alt="icon" />
              <span>
               update credentials
              </span>
            </button>
          
        </nav>
        <div className="px-6 py-4">
          <button className="py-2 font-medium bg-transparent
         rounded-md  hover:cursor-pointer
          flex items-center space-x-5 justify-center mx-auto w-fit" onClick={handleLogout}>
            <img src={logoutIcon} alt="icon" />
            <span >
              Logout
            </span>
        </button>
        </div>
        <img src={closeIcon} alt="icon"  onClick={()=>setIsSideBarOpen(!isSideBarOpen)} className="h-fit w-fit
         absolute top-0 right-4 mt-4  block md:hidden"/>
    </aside>
    {addNewAdminPopUp && <AddNewAdmin/>}
    {
      settingPopUp&&<SettingPopup/>
    }
    </>
  );
};

export default SideBar;
