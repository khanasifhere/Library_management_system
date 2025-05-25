import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
export const app = express();
import { config } from 'dotenv';
import { connectDB } from './database/db.js';
import {errorMiddleware} from './middlewares/errorMiddlewares.js';
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRouter.js';
import borrowRouter from './routes/borrowRouter.js';
import expressFileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import { notifyUser } from './services/notifyUser.js';
import { removeUnverifiedAccounts } from './services/removeUnverifiedAccounts.js';
config({path: './config/config.env'});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressFileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));




app.use(cors({
    origin: "https://library-management-system-ml77.vercel.app", 
    credentials: true,
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/book',bookRouter);
app.use('/api/v1/borrow', borrowRouter);
app.use('/api/v1/user', userRouter);
notifyUser();
removeUnverifiedAccounts();
connectDB();
app.use(errorMiddleware);
