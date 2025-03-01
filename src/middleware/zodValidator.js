export const validate = (schema) => async (req, res, next) => {
  try {
    if (schema.body) {
      await schema.body.parseAsync(req.body);
    }
    if (schema.query) {
      await schema.query.parseAsync(req.query);
    }
    return next();
  } catch (error) {
    return res.status(400).json({ errors: error.errors });
  }
};
