import errorHandler from "../middlewares/errorMiddlewares.js";
import bcrypt from "bcrypt";
import {User} from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return next(new errorHandler("Please enter all fields",400));
        }
        const isRegistered = await User.findOne({ email,accountVerified: true });
        if (isRegistered) {
            return next(new errorHandler("User already exists", 400));
        }
        const registrationAttemptsByUser = await User.find({ email, accountVerified: false });
        if(registrationAttemptsByUser.length >= 5) {
            return next(new errorHandler("You have exceeded the maximum number of registration attempts. Please contact support.", 400));
        }
        if(password.length < 8 || password.length > 16) {
            return next(new errorHandler("Password must be between 8 to 16 characters", 400));
        }
        const hasshedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hasshedPassword,
        });
        const verificationCode= await user.generateVerificationCode();
        await user.save();
        sendVerificationCode( verificationCode, email,res);

    }
    catch (error) { 
        return next(new errorHandler(error.message, 500));
    }}
        )
