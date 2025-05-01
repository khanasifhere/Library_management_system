import errorHandler from "../middlewares/errorMiddlewares.js";
import bcrypt from "bcrypt";
import {User} from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
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
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return next(new errorHandler("Email or OTP is missing", 400));
    }
    try{
        const userAllEntries = await User.find({ email, accountVerified: false }).sort({ createdAt: -1 });
        if(!userAllEntries) {
            return next(new errorHandler("User not found", 404));
        }
        let user;
        if(userAllEntries.length >1) {
            user = userAllEntries[0];
            await User.deleteMany({  _id: { $ne: user._id },email, accountVerified: false });
        }
        else {
            user=userAllEntries[0];
        }
        if(user.verificationCode !== Number(otp)) {
            return next(new errorHandler("Invalid OTP", 400));
        }
        const currentTime = new Date().getTime();
        const verificationCodeExpire=new Date(user.verificationCodeExpire).getTime();
        if(currentTime > verificationCodeExpire) {
            return next(new errorHandler("OTP expired", 400));
        }
        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;
        await user.save({validateModifiedOnly: true});
        sendToken(user,200,"account verified successfully", res);
    }
    catch (error) {
        return next(new errorHandler(error.message, 500));
    }
}
)
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorHandler("Please enter all fields", 400));
    }
    try {
        const user = await User.findOne({ email,accountVerified:true }).select("+password");
        if (!user) {
            return next(new errorHandler("Invalid credentials", 401));
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return next(new errorHandler("Invalid credentials", 401));
        }
        sendToken(user, 200, "Login successful", res);
    } catch (error) {
        return next(new errorHandler(error.message, 500));
    }
})
