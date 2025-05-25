import errorHandler from "../middlewares/errorMiddlewares.js";
import bcrypt from "bcrypt";
import {User} from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generatePasswordResetEmailTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";
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
        await User.deleteMany({ email, accountVerified: false });
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
export const logout = catchAsyncErrors(async (req, res, next) => {
    try {
        res.status(200)
        .cookie("token", "", {
            httpOnly: true,
                secure: true,         // Required for cross-origin
                sameSite: 'None',     // Required for cross-origin
                expires: new Date(0), 
        }).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return next(new errorHandler(error.message, 500));
    }
})
export const getUser=catchAsyncErrors(async (req, res, next) => {
    const user=await req.user;
    res.status(200).json({
        success:true,
        user,
    })

})
export const forgotPassword=catchAsyncErrors(async (req, res, next) => {
    if(!req.body.email) {
        return next(new errorHandler("Please enter email", 400));
    }
    const user=await User.findOne({
        email:req.body.email,
        accountVerified:true,
    })
    if(!user) {
        return next(new errorHandler("User not found", 404));
    }
    const resetToken=await user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl=`https://library-management-system-ml77.vercel.app/password/reset/${resetToken}`;
    const message=generatePasswordResetEmailTemplate( resetPasswordUrl);

    try {
        sendEmail({
            email:user.email,
            subject:"Library password recovery",
            message,
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new errorHandler(error.message, 500));
    }
} )
export const resetPassword=catchAsyncErrors(async (req, res, next) => { 
    const {token}=req.params;
    const resetPasswordToken=crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    })
    if(!user) {
        return next(new errorHandler("Reset password token is invalid or expired", 400));
    }
    if(req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler("Password and confirm password does not match", 400));
    }
    if(req.body.password.length < 8 || req.body.password.length > 16||req.body.confirmPassword.length < 8 || req.body.confirmPassword.length > 16) {
        return next(new errorHandler("Password must be between 8 to 16 characters", 400));
    }
    const hashedPassword=await bcrypt.hash(req.body.password, 10);
    user.password=hashedPassword;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user, 200, "Password reset successfully", res);
})
export const updatePassword=catchAsyncErrors(async (req, res, next) => {
    const user=await User.findById(req.user._id).select("+password");
    const {oldPassword,newPassword,confirmPassword}=req.body;
    if(!oldPassword || !newPassword || !confirmPassword) {
        return next(new errorHandler("Please enter all fields", 400));
    }
    if(newPassword !== confirmPassword) {
        return next(new errorHandler("New password and confirm password does not match", 400));
    }
    if(newPassword.length < 8 || newPassword.length > 16||confirmPassword.length < 8 || confirmPassword.length > 16) {
        return next(new errorHandler("Password must be between 8 to 16 characters", 400));
    }
    const isOldPasswordMatched=await bcrypt.compare(oldPassword, user.password);
    if(!isOldPasswordMatched) {
        return next(new errorHandler("Old password is incorrect", 400));
    }
    const hashedPassword=await bcrypt.hash(newPassword, 10);
    user.password=hashedPassword;
    await user.save();
    res.status(200).json({
        success:true,
        message:"Password updated successfully",
    })

})
