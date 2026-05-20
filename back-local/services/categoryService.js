import { prisma } from '../prisma.js';
import { AppError }from '../errors/appError.js';
import normalize from './normalizeText.js';

export const createCategory = async (data) => {
    let {nombre} = data;

    if (!nombre) {
        throw new AppError('El nombre es obligatorio', 400);
    }

    nombre = normalize(nombre);

    const category = await prisma.categorias.create({
        data: {
            nombre
        }
    });

    return category;
};

export const readCategoryById = async (data) => {
    const id = data;

    const category = await prisma.categorias.findUnique({
        where: {
            id: id
        }
    })

    return category
}

export const readCategory = async (data) => {
    let { nombre } = data;

    nombre = normalize(nombre);

    if (!nombre) {
        throw new AppError("Debe proveer nombre para buscar categoria", 400);
    }

    const category = await prisma.categorias.findMany({
        where: {
            nombre: {
                contains: nombre,
                mode: 'insensitive'
            }
        }
    })

    return category;
}

export const updateCategory = async (id, data) => {
    let { nombre } = data;
    nombre = normalize(nombre);

    const category = await prisma.categorias.update({
        where: {
            id: id,
        },
        data: { nombre }
    }
    )

    return category;
}

export const deleteCategory = async (id) => {
    const deletedCategory = await prisma.categorias.delete({
        where: {
            id: id
        }
    })

    return deletedCategory;
}
