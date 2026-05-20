import { AppError } from '../errors/appError.js';
import { isEmployee } from '../services/employeeValidationService.js';

export const requireEmployee = async (req, res, next) => {
  try {
    const employee = await isEmployee(req.session.user.id);
    if (!employee) return next(new AppError('Acceso restringido a empleados', 403));
    next();
  } catch (err) {
    next(err);
  }
};
