import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({accountVerified: true})
    
    res.status(200).json({
        success: true,
        users,
    });
});
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {    
    if(!req.files || Object.keys(req.files).length === 0) {
        return next(new errorHandler("Please upload an image", 400));
    }
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return next(new errorHandler("Please enter all fields", 400));
    }
    const isRegistered = await User.findOne({email,accountVerified: true});
    if(isRegistered) {
        return next(new errorHandler("User already registered", 400));
    }
    if(password.length<8||password.length>16) {
        return next(new errorHandler("Password should be between 8 to 16 characters", 400));
    }
    
});