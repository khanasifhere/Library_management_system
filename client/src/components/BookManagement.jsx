import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import {useDispatch,useSelector} from "react-redux"
import { toggleAddBookPopUp, toggleReadBookPopUp, toggleRecordBookPopUp } from "../store/slices/popUpSlice.js";
import { toast } from "react-toastify";
import Header from "../layout/Header.jsx"
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice.js";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice.js";
import AddBookPopup from "../popups/AddBookPopup.jsx"
import ReadBookPopup from "../popups/ReadBookPopup.jsx"
import RecordBookPopup from "../popups/RecordBookPopup.jsx"
const BookManagement = () => {
  const dispatch=useDispatch();
  const{loading,error,message,books}=useSelector((state)=>state.book)
  const{user,isAuthenticated}=useSelector((state)=>state.auth);
  const{settingPopUp,
        addBookPopUp,
        readBookPopUp,
        recordBookPopUp,
        returnBookPopUp,
        addNewAdminPopUp}=useSelector((state)=>state.popup);
  const{
    loading:borrowSliceLoading,
    error:borrowSliceError,
    message:borrowSliceMessage,
  }=useSelector((state)=>state.borrow);
  const[readBook,setReadBook]=useState({});
  const openReadPopup=(id)=>{
    const book =books.find(book=>book._id===id);
    setReadBook(book);
    dispatch(toggleReadBookPopUp());
  }
  const[borrowBookId,setBorrowBookId]=useState("")
  const openRecordBookPopup=(bookId)=>{
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopUp());
  }
  useEffect(()=>{
    if(message||borrowSliceMessage){
      toast.success(message||borrowSliceMessage)
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSlice());
      dispatch(resetBookSlice());
    }
    if(error||borrowSliceError){
      toast.error(error||borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  },[dispatch,message,error,loading,borrowSliceError,
    borrowSliceLoading,borrowSliceMessage])
    const [searchedKeyword,setSearchKeyword]=useState("");
    const handleSearch=(e)=>{
      setSearchKeyword(e.target.value.toLowerCase());
    }
    const searchedBooks=books.filter((book)=>
      book.title.toLowerCase().includes(searchedKeyword)
    )
  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header/>
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">{user&&user.role==="admin"?"Book Management":"Books"}</h2>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
         {
          isAuthenticated&&user?.role==="admin"&&(
            <button className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800" onClick={()=>dispatch(toggleAddBookPopUp())}>
              <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px]  absolute left-5">+</span>
              Add Book
            </button>
          )
         }
         <input type="text" 
         placeholder="search books ..." 
         value={searchedKeyword}
         onChange={handleSearch}
         className="w-full sm:w-52 border p-2 border-gray-300 rounded-md" />
        </div>
      </header>
      {
        books&&books.length>0?(
          <div className="mt-6 overflow-hidden bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  {
                    isAuthenticated&&user?.role==="admin"&&(
                    <th className="px-4 py-2 text-left">Quantity</th>

                    )
                  }
                  <th className="px-4 py-2 text-left">Price</th>

                  <th className="px-4 py-2 text-left">Availability</th>
{
                    isAuthenticated&&user?.role==="admin"&&(
                    <th className="px-4 py-2 text-center">Record Book</th>

                    )
                  }
                </tr>
              </thead>
              <tbody>
                {
                  searchedBooks.map((book,index)=>(
                    <tr key={book._id} className={(index+1)%2===0?"bg-gray-50":""}>
                      <td className="px-4 py-2">{index+1}</td>
                      <td className="px-4 py-2">{book.title}</td>
                      <td className="px-4 py-2">{book.author}</td>
                      {
                        isAuthenticated&&user?.role=="admin"&&(
                          <td className="px-4 py-2">{book.quantity}</td>
                        )
                      }
                      <td className="px-4 py-2">{`$${book.price}`}</td>
                      <td className="px-4 py-2">{book.availability?"Available":"Unavailable"}</td>
                        {
                        isAuthenticated&&user?.role=="admin"&&(
                          <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                            <BookA onClick={()=>openReadPopup(book._id)}/>
                             <NotebookPen onClick={()=>openRecordBookPopup(book._id)}/> 
                            </td>
                        )
                      }                   

                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        ):(
          <h3 className="text-3xl mt-5 font-medium">No Books found in Library</h3>
        )
      }
    </main>
    {addBookPopUp&&<AddBookPopup/>}
    {readBookPopUp&&<ReadBookPopup book={readBook}/>}
    {recordBookPopUp&&<RecordBookPopup bookId={borrowBookId}/>}
  </>;
};

export default BookManagement;
