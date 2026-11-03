const validate = (rules) => (req, res, next) => {
  const errors = [];
  for (const [field, checks] of Object.entries(rules)) {
    const value = req.body[field];
    if (checks.required && (value === undefined || value === null || value === "")) {
      errors.push(`Le champ "${field}" est requis`);
      continue;
    }
    if (value !== undefined && checks.minLength && String(value).length < checks.minLength) {
      errors.push(`Le champ "${field}" doit contenir au moins ${checks.minLength} caracteres`);
    }
    if (value !== undefined && checks.type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      errors.push(`Le champ "${field}" doit etre un email valide`);
    }
  }
  if (errors.length) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};

module.exports = validate;
