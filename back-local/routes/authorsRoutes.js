import { Router } from "express";
import { body } from 'express-validator';
import { createAuthor, readAuthor, readAuthorById, updateAuthor, deleteAuthor } from '../controllers/authorsController.js';
import { requireLogin } from '../middleware/validateSession.js';
import { requireEmployee } from "../middleware/employeeValidation.js";


const authorsRoutes = Router();

authorsRoutes.use(requireLogin);


authorsRoutes.get('', readAuthor);
authorsRoutes.get('/:id', readAuthorById);

authorsRoutes.post('', requireEmployee, [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], createAuthor);

authorsRoutes.put('/:id', requireEmployee, updateAuthor);

authorsRoutes.delete('/:id', requireEmployee, deleteAuthor);

export default authorsRoutes;
