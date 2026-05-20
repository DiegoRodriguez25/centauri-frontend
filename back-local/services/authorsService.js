import { prisma } from '../prisma.js';
import { AppError } from '../errors/appError.js';
import normalize from './normalizeText.js';

export const createAuthor = async (data) => {
    let { nombre } = data;
    nombre = normalize(nombre);

    if (!nombre) {
        throw new AppError('El nombre es obligatorio', 400);
    }

    const author = await prisma.autores.create({
        data: {
            nombre
        }
    });

    return author;
};

export const readAuthorById = async (data) => {
    const id = data;

    const author = await prisma.autores.findUnique({
        where: {
            id: id
        }
    })

    return author
}

export const readAuthor = async (data) => {
    let { nombre } = data;

    nombre = normalize(nombre);

    if (!nombre) {
        throw new AppError("Debe proveer nombre para buscar autor", 400);
    }

    const author = await prisma.autores.findMany({
        where: {
            nombre: {
                contains: nombre,
                mode: 'insensitive'
            }
        }
    })

    return author
}

export const updateAuthor = async (id, data) => {
    let { nombre } = data;
    nombre = normalize(nombre);

    const author = await prisma.autores.update({
        where: {
            id: id,
        },
        data: { nombre }
    }
    )

    return author;
}

export const deleteAuthor = async (id) => {
    const deletedAuthor = await prisma.autores.delete({
        where: {
            id: id
        }
    })

    return deletedAuthor;
}