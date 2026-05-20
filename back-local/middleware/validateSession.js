import { AppError } from "../errors/appError.js";

export const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    const err = new AppError("No autorizado", 401);
    throw err;
  }
  // User is logged in, proceed
  next();
}

export default requireLogin;