import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    accountVerified: {
        type: Boolean,
        default: false,
    },
    borrowedBooks: [
        {
            bookId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Borrow",
                
            },
                returned:{
                    type: Boolean,
                    default: false,
                },
                bookTitle:String,
                borrowedDate:Date,
                dueDate:Date,

            
        },
    ],
    avatar:{
        public_id:String,
        url:String,
    },
    verificationCode:Number,
    verificationCodeExpire:Date,
    resetPasswordToken:String,
    resetPasswordExpire:Date,
}, { timestamps: true });
userSchema.methods.generateVerificationCode=function(){
    function generateRandomFiveDigitNumber() {
        const FirstDigit = Math.floor(Math.random() * 9) + 1; // First digit cannot be 0
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4,0); // Remaining 4 digits can be anything from 0000 to 9999
return parseInt(FirstDigit+remainingDigits);    }
const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    return verificationCode;

}

export const User = mongoose.model("User", userSchema);