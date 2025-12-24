module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  const payload = {
    message: err.message || "Server error",
  };

  if (err.details) payload.details = err.details;

  // show stack only in non-production
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};
