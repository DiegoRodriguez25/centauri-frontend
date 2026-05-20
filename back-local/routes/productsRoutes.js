import { Router } from "express";
import { body } from "express-validator";
import {
  createProduct,
  readProduct,
  readProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";
import { requireLogin } from "../middleware/validateSession.js";
import { requireEmployee } from "../middleware/employeeValidation.js";
import { upload } from "../middleware/upload.js";

const productsRoutes = Router();

productsRoutes.use(requireLogin);

productsRoutes.get("", readProduct);
productsRoutes.get("/:id", readProductById);

productsRoutes.post(
  "",
  requireEmployee,
  upload.single("imagen"),
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("existencias")
      .isInt({ min: 0 })
      .withMessage(
        "Las existencias deben ser un número entero mayor o igual a 0",
      ),
    body("fecha_publicacion")
      .isDate()
      .withMessage("La fecha de publicación no es válida"),
    body("id_tipo").notEmpty().withMessage("El tipo es obligatorio"),
    body("id_autor").notEmpty().withMessage("El autor es obligatorio"),
    body("id_editorial").notEmpty().withMessage("La editorial es obligatoria"),
    body("id_categoria").notEmpty().withMessage("La categoría es obligatoria"),
  ],
  createProduct,
);

productsRoutes.put("/:id", requireEmployee, updateProduct);

productsRoutes.delete("/:id", requireEmployee, deleteProduct);

export default productsRoutes;
