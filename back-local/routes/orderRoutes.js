import { Router } from "express";
import { requireLogin } from "../middleware/validateSession.js";
import { createOrder } from "../controllers/orderController.js";

const orderRoutes = Router();

orderRoutes.use(requireLogin);

orderRoutes.post('', createOrder);

export default orderRoutes;
