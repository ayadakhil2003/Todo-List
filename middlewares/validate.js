function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Optional: overwrite with validated values
      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      if (parsed.query) req.query = parsed.query;

      next();
    } catch (err) {
      const e = new Error("Validation error");
      e.statusCode = 400;
      e.details = err.errors || err;
      next(e);
    }
  };
}

module.exports = validate;
