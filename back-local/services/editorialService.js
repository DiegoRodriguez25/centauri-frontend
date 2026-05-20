import { prisma } from '../prisma.js';
import { AppError }from '../errors/appError.js';
import normalize from './normalizeText.js';

export const createEditorial = async (data) => {
    let {nombre} = data;

    if (!nombre) {
        throw new AppError('El nombre es obligatorio', 400);
    }

    nombre = normalize(nombre);

    const editorial = await prisma.editoriales.create({
        data: {
            nombre
        }
    });

    return editorial;
};

export const readEditorialById = async (data) => {
    const id = data;

    const editorial = await prisma.editoriales.findUnique({
        where: {
            id: id
        }
    })

    return editorial
}

export const readEditorial = async (data) => {
    let { nombre } = data;

    nombre = normalize(nombre);

    if (!nombre) {
        throw new AppError("Debe proveer nombre para buscar categoria", 400);
    }

    const editorial = await prisma.editoriales.findMany({
        where: {
            nombre: {
                contains: nombre,
                mode: 'insensitive'
            }
        }
    })

    return editorial;
}

export const updateEditorial = async (id, data) => {
    let { nombre } = data;
    nombre = normalize(nombre);

    const editorial = await prisma.editoriales.update({
        where: {
            id: id,
        },
        data: { nombre }
    }
    )

    return editorial;
}

export const deleteEditorial = async (id) => {
    const deletedEditorial = await prisma.editoriales.delete({
        where: {
            id: id
        }
    })

    return deletedEditorial;
}