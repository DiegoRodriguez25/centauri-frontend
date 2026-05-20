import { Router } from "express";
import { deleteProductFromCart, getCartByClientId, addProductToCart } from "../controllers/cartController.js";
import { requireLogin } from "../middleware/validateSession.js";


const cartRoutes = Router();

cartRoutes.use(requireLogin);

cartRoutes.get('', getCartByClientId);
cartRoutes.post('/:idProducto', addProductToCart);
cartRoutes.delete('/:idProducto', deleteProductFromCart);

export default cartRoutes;
