import * as cartService from "../services/cartService.js";

export const getCartByClientId = async (req, res, next) => {
    try {
        const idCliente = req.session.user.id_cliente;
        const cart = await cartService.getCartByClientId(idCliente);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addProductToCart = async (req, res, next) => {
    try {
        const { idProducto } = req.params;
        const idCliente = req.session.user.id_cliente;

        const cart = await cartService.addProductToCart(idCliente, idProducto);
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }
};

export const deleteProductFromCart = async (req, res, next) => {
    try {
        const { idProducto } = req.params;
        const idCliente = req.session.user.id_cliente;

        const cart = await cartService.deleteProductFromCart(idCliente, idProducto);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};
