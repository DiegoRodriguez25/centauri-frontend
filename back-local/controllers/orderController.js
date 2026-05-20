import * as orderService from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
    try {
        const idCliente = req.session.user.id_cliente;
        const { idEmpleado } = req.body;

        const order = await orderService.createOrder(idCliente, idEmpleado);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};
