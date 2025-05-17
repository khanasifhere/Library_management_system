import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { Borrow } from "../models/borrowModel.js";
import { calculateFine } from "../utils/fineCalculator.js";
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
    const {borrowedBooks} = req.user;
    res.status(200).json({
        success: true,
        borrowedBooks,
    });
     
});
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const {email} = req.body;
    const book = await Book.findById(id);
    if (!book) {
        return next(new errorHandler("Book not found", 404));
    }
    const user = await User.findOne({email});
    if(!user) {
        return next(new errorHandler("User not found", 404));
    }
    if(book.quantity === 0) {
        return next(new errorHandler("Book is not available", 400));
    }
    const isAlreadyBorrowed = user.borrowedBooks.find(
        (b) => b.bookId.toString() === id && b.returned === false
    );
    if (isAlreadyBorrowed) {
        return next(new errorHandler("Book already borrowed", 400));
    }
    book.quantity -= 1;
    book.availability = book.quantity >0;
    await book.save();
    user.borrowedBooks.push({
        bookId: book._id,
        bookTitle: book.title,
        borrowedDate: Date.now(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();
    await Borrow.create({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        book: book._id,
        price: book.price,
        
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.status(200).json({
        success: true,
        message: "Book borrowed successfully",
    });
});
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
    const borrowedBooks = await Borrow.find();
    res.status(200).json({
        success: true,
        borrowedBooks,
    });
});
export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const { email } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
        return next(new errorHandler("Book not found", 404));
    }
    const user = await User.findOne({email,accountVerified: true});
    if(!user) {
        return next(new errorHandler("User not found", 404));
    }
    const borrowedBook = user.borrowedBooks.find(
        (b) => b.bookId.toString() === bookId && b.returned === false
    );
    if(!borrowedBook) {
        return next(new errorHandler("Book not borrowed", 400));
    }
    borrowedBook.returned = true;
    await user.save();
    book.quantity += 1;
    book.availability = true;
    await book.save();
    const borrow = await Borrow.findOne({
        
        book: book._id,
        "user.email": email,
        returnDate: null,
    });
    if(!borrow) {
        return next(new errorHandler("Borrow record not found", 404));
    }
borrow.returnDate = Date.now();
   const fine=calculateFine(borrow.dueDate);
   borrow.fine = fine;
    await borrow.save();
    res.status(200).json({
        success: true,
        message: fine > 0 ? `Book returned successfully. Fine: ${fine}` : "Book returned successfully without fine",
    });

});