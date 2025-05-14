import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

import{ Book }from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import errorHandler from "../middlewares/errorMiddlewares.js";
export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price,quantity} = req.body;
    if (!title || !author || !description || !price || !quantity) {
        return next(new errorHandler("Please enter all fields", 400));
    }
    const book = await Book.create({
        title,
        author,
        description,
        price,
        quantity,
    });
    res.status(201).json({
        success: true,
        message: "Book added successfully",
        book,
    });
});
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books,
    });
});
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return next(new errorHandler("Book not found", 404));
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
    });
});