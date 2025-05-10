class errorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
export const errorMiddleware = (err, req, res, next) => { 
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    // Mongoose bad ObjectId error
    if (err.name === "CastError") {
        const statusCode = 400;
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new errorHandler(message, statusCode);
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate Field value entered`;
        const statusCode = 400;
        err = new errorHandler(message, statusCode);
    }
    
    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is invalid. Try again";
        const statusCode = 400;
        err = new errorHandler(message, statusCode);
    }
    
    // JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is expired. Try again";
        const statusCode = 400;
        err = new errorHandler(message, statusCode);
    }
    const errorMessage=err.errors
    ? Object.values(err.errors).map(error => error.message).join(" ")
    : err.message;
    
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
    }
    export default errorHandler;