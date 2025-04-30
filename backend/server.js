import express from 'express';
import {app} from './app.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
app.listen(process.env.PORT, () => {
  console.log('Server is running on port ' + process.env.PORT);
})
