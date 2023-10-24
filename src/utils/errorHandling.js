//Error handling function
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(error => {
      return next(new Error(error, { cause: 500 }))
    })
  }
};
//Error handling global middleware
export const globalErrorHandling = (error, req, res, next) => {
  return res
    .status(error.cause)
    .json({
      message: error.message,
      status: error.cause
      //stack: error.stack,
    });
};