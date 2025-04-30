import mongoose,{connect} from "mongoose";
export const connectDB = async () => {  
   await mongoose.connect(process.env.MONGO_URI, {
        dbName: "MERN_Library",

    }).then(() => {
        console.log("Connected to MongoDB successfully");
    }).catch((error) => {
        console.log("Error connecting to MongoDB", error.message);
    })
}