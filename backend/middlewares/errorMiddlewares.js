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
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new errorHandler(message, 400);
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate Field value entered`;
        err = new errorHandler(message, 400);
    }
    
    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is invalid. Try again";
        err = new errorHandler(message, 400);
    }
    
    // JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is expired. Try again";
        err = new errorHandler(message, 400);
    }
    const errorMessage=err.errors
    ? Object.values(err.errors).map((error) => error.message).join(" ")
    : err.message;
    res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
    }
    export default errorHandler;