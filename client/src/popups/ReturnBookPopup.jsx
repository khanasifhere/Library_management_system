import React from 'react'
import { useDispatch } from 'react-redux'
import { returnBook } from '../store/slices/borrowSlice.js';
import { toggleReturnBookPopUp } from '../store/slices/popUpSlice.js';

const ReturnBookPopup = ({bookId,email}) => {
  const dispatch=useDispatch();
  const handleReturnBook=(e)=>{
    e.preventDefault();
    dispatch(returnBook({email,id:bookId}));
    dispatch(toggleReturnBookPopUp());
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center
         justify-center z-50">
          <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className='p-6'>
            <h3 className='text-xl font-bold mb-4 '>Return Book</h3>
            <form onSubmit={handleReturnBook}>
              <div className='mb-4'>
                <label className='block text-gray-900 font-medium'> User email</label>
               <input required type="email" 
               defaultValue={email} 
               disabled
               placeholder='Borrower`s email'
               className='w-full px-4 py-2 border-2 border-black rounded-md'/>
              </div>
              <div className='flex justify-end space-x-4'>
                <button onClick={()=>dispatch(toggleReturnBookPopUp())} type='button' className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'>Close</button>
                <button type='submit' className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800'>Return</button>
    
              </div>
            </form>
          </div>
         </div>
         </div>
  )
}

export default ReturnBookPopup
