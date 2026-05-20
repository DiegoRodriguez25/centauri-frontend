import { prisma } from '../prisma.js';
import { AppError } from '../errors/appError.js';

export const getCartByClientId = async (idCliente) => {
    if (!idCliente) {
        throw new AppError('El id del cliente es obligatorio', 400);
    }

    const cliente = await prisma.clientes.findUnique({
        where: {
            id: idCliente
        }
    });

    if (!cliente) {
        throw new AppError('El cliente indicado no existe', 404);
    }

    const carrito = await prisma.carritos.findMany({
        where: {
            id_cliente: idCliente
        },
        include: {
            producto: true
        }
    });

    if (carrito.length === 0) {
        return {
            mensaje: 'El carrito esta vacio',
            data: []
        };
    }

    return {
        mensaje: 'Carrito obtenido exitosamente',
        data: [carrito]
    };
};

export const addProductToCart = async (idCliente, idProducto) => {
    if (!idCliente || !idProducto) {
        throw new AppError('El id del cliente y el id del producto son obligatorios', 400);
    }

    const cliente = await prisma.clientes.findUnique({
        where: {
            id: idCliente
        }
    });

    if (!cliente) {
        throw new AppError('El cliente indicado no existe', 404);
    }

    const producto = await prisma.productos.findUnique({
        where: {
            id: idProducto
        }
    });

    if (!producto) {
        throw new AppError('El producto indicado no existe', 404);
    }

    const productoEnCarrito = await prisma.carritos.findUnique({
        where: {
            id_cliente_id_producto: {
                id_cliente: idCliente,
                id_producto: idProducto
            }
        }
    });

    if (producto.existencias <= 0) {
        throw new AppError('El producto no tiene existencias disponibles', 400);
    }

    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad >= producto.existencias) {
            throw new AppError('No hay mas existencias disponibles para este producto', 400);
        }

        const productoActualizado = await prisma.carritos.update({
            where: {
                id_cliente_id_producto: {
                    id_cliente: idCliente,
                    id_producto: idProducto
                }
            },
            data: {
                cantidad: {
                    increment: 1
                }
            },
            include: {
                producto: true
            }
        });

        return {
            mensaje: 'Cantidad del producto actualizada exitosamente',
            data: productoActualizado
        };
    }

    const productoAgregado = await prisma.carritos.create({
        data: {
            id_cliente: idCliente,
            id_producto: idProducto
        },
        include: {
            producto: true
        }
    });

    return {
        mensaje: 'Producto agregado al carrito exitosamente',
        data: productoAgregado
    };
};

export const deleteProductFromCart = async (idCliente, idProducto) => {
    if (!idCliente || !idProducto) {
        throw new AppError('El id del cliente y el id del producto son obligatorios', 400);
    }

    const productoEnCarrito = await prisma.carritos.findUnique({
        where: {
            id_cliente_id_producto: {
                id_cliente: idCliente,
                id_producto: idProducto
            }
        },
        include: {
            producto: true
        }
    });

    if (!productoEnCarrito) {
        throw new AppError('El producto no se encuentra en el carrito', 404);
    }

    if (productoEnCarrito.cantidad > 1) {
        const productoActualizado = await prisma.carritos.update({
            where: {
                id_cliente_id_producto: {
                    id_cliente: idCliente,
                    id_producto: idProducto
                }
            },
            data: {
                cantidad: {
                    decrement: 1
                }
            },
            include: {
                producto: true
            }
        });

        return {
            mensaje: 'Cantidad del producto actualizada exitosamente',
            data: productoActualizado
        };
    }

    const productoEliminado = await prisma.carritos.delete({
        where: {
            id_cliente_id_producto: {
                id_cliente: idCliente,
                id_producto: idProducto
            }
        },
        include: {
            producto: true
        }
    });

    return {
        mensaje: 'Producto eliminado del carrito exitosamente',
        data: productoEliminado
    };
};
