import { prisma } from '../prisma.js';

export const isEmployee = async (id_user) => {
    const employee = await prisma.empleados.findFirst({
        where: { id_usuario: id_user }
    });

    return employee;
}