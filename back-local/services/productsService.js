import { prisma } from '../prisma.js';
import { AppError } from '../errors/appError.js';
import normalize from './normalizeText.js';

export const createProduct = async (data, imagePath = null) => {
    let {
        nombre,
        existencias,
        fecha_publicacion,
        id_tipo,
        id_autor,
        id_editorial,
        id_categoria
    } = data;

    if (!nombre || existencias === undefined || !fecha_publicacion || !id_tipo || !id_autor || !id_editorial || !id_categoria) {
        throw new AppError('Nombre, existencias, fecha de publicacion, tipo, autor, editorial y categoria son obligatorios', 400);
    }

    const existenciasNumber = Number(existencias);

    if (!Number.isInteger(existenciasNumber) || existenciasNumber < 0) {
        throw new AppError('Las existencias deben ser un numero entero mayor o igual a 0', 400);
    }

    const fechaPublicacionDate = new Date(fecha_publicacion);

    if (Number.isNaN(fechaPublicacionDate.getTime())) {
        throw new AppError('La fecha de publicacion no es valida', 400);
    }

    const [tipo, autor, editorial, categoria] = await Promise.all([
        prisma.tipos.findUnique({ where: { id: id_tipo } }),
        prisma.autores.findUnique({ where: { id: id_autor } }),
        prisma.editoriales.findUnique({ where: { id: id_editorial } }),
        prisma.categorias.findUnique({ where: { id: id_categoria } })
    ]);

    if (!tipo) {
        throw new AppError('El tipo indicado no existe', 404);
    }

    if (!autor) {
        throw new AppError('El autor indicado no existe', 404);
    }

    if (!editorial) {
        throw new AppError('La editorial indicada no existe', 404);
    }

    if (!categoria) {
        throw new AppError('La categoria indicada no existe', 404);
    }

    nombre = normalize(nombre);

    const producto = await prisma.productos.create({
        data: {
            nombre,
            existencias: existenciasNumber,
            fecha_publicacion: fechaPublicacionDate,
            id_tipo,
            id_autor,
            id_editorial,
            id_categoria,
            imagen: imagePath
        },
        include: {
            tipo: true,
            autor: true,
            editorial: true,
            categoria: true
        }
    });

    return {
        mensaje: 'Producto creado exitosamente',
        data: producto
    };
};

export const readProduct = async ({ nombre, autor, editorial, tipo, categoria }) => {

    nombre = normalize(nombre);
    autor = normalize(autor);
    editorial = normalize(editorial);
    tipo = normalize(tipo);
    categoria = normalize(categoria);

    const where = {
        ...(nombre && {
            nombre:
                { contains: nombre, mode: 'insensitive' }
        }),
        ...(autor && {
            autor: {
                is:
                    { nombre: { contains: autor, mode: 'insensitive' } }
            }
        }),
        ...(editorial && {
            editorial: {
                is:
                    { nombre: { contains: editorial, mode: 'insensitive' } }
            }
        }),
        ...(tipo && {
            tipo: {
                is:
                    { nombre: { contains: tipo, mode: 'insensitive' } }
            }
        }),
        ...(categoria && {
            categoria:
            {
                is: {
                    nombre: { contains: categoria, mode: 'insensitive' }
                }
            }
        }),
    };

    const products = await prisma.productos.findMany({
        where,
        include: {
            tipo: true,
            autor: true,
            editorial: true,
            categoria: true,
        }
    });


    return products;
}

export const readProductById = async (id) => {
    const product = await prisma.productos.findUnique({
        where: {id: id},
                include: {
            tipo: true,
            autor: true,
            editorial: true,
            categoria: true,
        }
    });

    return product;
}

export const updateProduct = async (id, { nombre, id_autor, existencias, fecha_publicacion, id_editorial, id_tipo, id_categoria }) => {

    const updatedProduct = await prisma.productos.update({
        where: { id: id },
        data: { nombre, id_autor, existencias, fecha_publicacion, id_editorial, id_tipo, id_categoria }
    });

    return updatedProduct;
}

export const deleteProduct = async (id) => {
    const deletedProduct = await prisma.productos.delete({
        where: {
            id: id
        }
    })

    return deletedProduct;
}