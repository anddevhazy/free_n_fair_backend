export const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message || "Internal Server Error",
    },
  });
};
