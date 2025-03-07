export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error?.errors || "Invalid request",
    });
  }
};
