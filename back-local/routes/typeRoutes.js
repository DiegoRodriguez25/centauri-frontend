import { Router } from "express";
import { body } from 'express-validator';
import { requireLogin } from '../middleware/validateSession.js';
import { requireEmployee } from "../middleware/employeeValidation.js";
import { createType, deleteType, readType, readTypeById, updateType } from "../controllers/typeController.js";

const typeRoutes = Router();

typeRoutes.use(requireLogin);

typeRoutes.get('', readType);
typeRoutes.get('/:id', readTypeById);

typeRoutes.post('', requireEmployee, [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], createType);

typeRoutes.put('/:id', requireEmployee, updateType);

typeRoutes.delete('/:id', requireEmployee, deleteType);

export default typeRoutes;