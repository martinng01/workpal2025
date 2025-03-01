export const validate = (schema) => async (req, res, next) => {
  console.log(req.body);

  try {
    await schema.parseAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json(error);
  }
};
