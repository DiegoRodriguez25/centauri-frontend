import { prisma } from '../prisma.js';
import { AppError } from '../errors/appError.js';

export const createOrder = async (idCliente, idEmpleado) => {
    if (!idCliente || !idEmpleado) {
        throw new AppError('El id del cliente y el id del empleado son obligatorios', 400);
    }

    const cliente = await prisma.clientes.findUnique({
        where: {
            id: idCliente
        }
    });

    if (!cliente) {
        throw new AppError('El cliente indicado no existe', 404);
    }

    if (!cliente.activo) {
        throw new AppError('El cliente indicado no esta activo', 400);
    }

    const empleado = await prisma.empleados.findUnique({
        where: {
            id: idEmpleado
        }
    });

    if (!empleado) {
        throw new AppError('El empleado indicado no existe', 404);
    }

    if (!empleado.activo) {
        throw new AppError('El empleado indicado no esta activo', 400);
    }

    const estado = await prisma.estados.findFirst({
        where: {
            nombre: {
                equals: 'Aceptado',
                mode: 'insensitive'
            }
        }
    });

    if (!estado) {
        throw new AppError('No se encontro un estado valido para el pedido', 404);
    }

    const pedido = await prisma.$transaction(async (tx) => {
        const carrito = await tx.carritos.findMany({
            where: {
                id_cliente: idCliente
            },
            include: {
                producto: true
            }
        });

        if (carrito.length === 0) {
            throw new AppError('El carrito esta vacio', 400);
        }

        const productosSinStock = carrito.filter((item) => (
            item.producto.existencias < item.cantidad
        ));

        if (productosSinStock.length > 0) {
            const nombres = productosSinStock
                .map((item) => item.producto.nombre)
                .join(', ');

            throw new AppError(`No hay existencias suficientes para: ${nombres}`, 400);
        }

        const precioTotal = carrito.reduce((total, item) => (
            total + item.producto.precio * item.cantidad
        ), 0);

        const cantidadProductos = carrito.reduce((total, item) => (
            total + item.cantidad
        ), 0);

        const pedidoCreado = await tx.pedidos.create({
            data: {
                precio: precioTotal,
                cantidad_productos: cantidadProductos,
                fecha_pedido: new Date(),
                id_cliente: idCliente,
                id_empleado: idEmpleado,
                id_estado: estado.id,
                detalles: {
                    create: carrito.map((item) => ({
                        id_producto: item.id_producto,
                        cantidad: item.cantidad,
                        precio: item.producto.precio
                    }))
                }
            },
            include: {
                detalles: {
                    include: {
                        producto: true
                    }
                },
                cliente: true,
                empleado: true,
                estado: true
            }
        });

        for (const item of carrito) {
            const productoActualizado = await tx.productos.updateMany({
                where: {
                    id: item.id_producto,
                    existencias: {
                        gte: item.cantidad
                    }
                },
                data: {
                    existencias: {
                        decrement: item.cantidad
                    }
                }
            });

            if (productoActualizado.count === 0) {
                throw new AppError(`No hay existencias suficientes para: ${item.producto.nombre}`, 400);
            }
        }

        await tx.carritos.deleteMany({
            where: {
                id_cliente: idCliente
            }
        });

        return pedidoCreado;
    });

    return {
        mensaje: 'Pedido creado exitosamente',
        data: pedido
    };
};
