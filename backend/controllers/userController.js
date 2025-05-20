import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
import {v2 as cloudinary} from 'cloudinary';
import bcrypt from 'bcrypt';
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
    const {avatar}=req.files;
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if(!allowedFormats.includes(avatar.mimetype)) {
        return next(new errorHandler("Please upload a valid image", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
        folder: 'Library_Avatars',
        
    });
    if(!cloudinaryResponse||cloudinaryResponse.error) {
        console.error(cloudinaryResponse.error);
        return next(new errorHandler("Error uploading image", 500));
    }
    const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
        role: 'admin',
        accountVerified: true,
    });
    res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        admin,
    });

});