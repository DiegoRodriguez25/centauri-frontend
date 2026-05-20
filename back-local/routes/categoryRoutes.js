import { Router } from "express";
import { body } from 'express-validator';
import { createCategory, deleteCategory, readCategory, readCategoryById, updateCategory } from '../controllers/categoryController.js';
import { requireLogin } from '../middleware/validateSession.js';
import { requireEmployee } from "../middleware/employeeValidation.js";

const categoryRoutes = Router();

categoryRoutes.use(requireLogin);

categoryRoutes.get('', readCategory);
categoryRoutes.get('/:id', readCategoryById);

categoryRoutes.post('', requireEmployee, [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], createCategory);

categoryRoutes.put('/:id', requireEmployee, updateCategory);

categoryRoutes.delete('/:id', requireEmployee, deleteCategory);


export default categoryRoutes;