import { prisma } from '../prisma.js';
import { AppError }from '../errors/appError.js';
import normalize from './normalizeText.js';

export const createType = async (data) => {
    let {nombre} = data;

    if (!nombre) {
        throw new AppError('El nombre es obligatorio', 400);
    }

    nombre = normalize(nombre);

    const type = await prisma.tipos.create({
        data: {
            nombre
        }
    });

    return type;
};

export const readTypeById = async (data) => {
    const id = data;

    const type = await prisma.tipos.findUnique({
        where: {
            id: id
        }
    })

    return type
}

export const readType = async (data) => {
    let { nombre } = data;

    nombre = normalize(nombre);

    if (!nombre) {
        throw new AppError("Debe proveer nombre para buscar categoria", 400);
    }

    const type = await prisma.tipos.findMany({
        where: {
            nombre: {
                contains: nombre,
                mode: 'insensitive'
            }
        }
    })

    return type;
}

export const updateType = async (id, data) => {
    let { nombre } = data;
    nombre = normalize(nombre);

    const type = await prisma.tipos.update({
        where: {
            id: id,
        },
        data: { nombre }
    }
    )

    return type;
}

export const deleteType = async (id) => {
    const deletedType = await prisma.tipos.delete({
        where: {
            id: id
        }
    })

    return deletedType;
}