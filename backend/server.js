import express from 'express';
import {app} from './app.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
  console.log('Server is running on port ' + process.env.PORT);
})
