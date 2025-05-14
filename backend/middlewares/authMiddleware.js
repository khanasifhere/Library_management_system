import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import errorHandler from "./errorMiddlewares.js";
import { User } from "../models/userModel.js";
export const isAuthenticated=catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return next(new errorHandler("user is not authenticated", 400));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
})
export const isAuthorized=(...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}