import React from "react";
import {useState} from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import {useSelector} from "react-redux";
import { useNavigate,Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar.jsx";
import AdminDashboard from "../components/AdminDashboard.jsx";
import UserDashboard from "../components/UserDashboard.jsx";
import BookManagement from "../components/BookManagement.jsx";
import Catalog from "../components/Catalog.jsx";
import Users from "../components/Users.jsx";
import MyBorrowedBooks from "../components/MyBorrowedBooks.jsx";
const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("" );
  const {user,isAuthenticated}=useSelector((state)=>state.auth);
  if(!isAuthenticated){
    return <Navigate to={"/login" }/>;
  }
  return <>
  <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
    <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex items-center justify-center bg-black rounded-md h-9 w-9 text-white">
      <GiHamburgerMenu className="text-2xl " onClick={()=>setIsSideBarOpen(!isSideBarOpen)}/>
    </div>
    <SideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} setSelectedComponent={setSelectedComponent}/>
  {
    (
      ()=> {
        switch (selectedComponent) {
          case "Dashboard":
            return user?.role==="admin" ? (<AdminDashboard/>) : (<UserDashboard/>);
            break;
          case "Books":
            return <BookManagement />;
            break;
          case "Catalog":
            if(user.role==="admin"){
              return <Catalog/>
            }
            break;
          case "Users":
            if(user.role==="admin"){
              return <Users/>
            }
            break;
          case "My Borrowed Books":
            return <MyBorrowedBooks/>
            break;

          default:
            return user?.role==="admin" ? (<AdminDashboard/>) : (<UserDashboard/>);
            break;
        }
      }
    )()
  }
  </div>
  </>;
};

export default Home;
