import * as productsService from '../services/productsService.js';
import * as storageService from '../services/storageService.js'

export const createProduct = async (req, res, next) => {

    let image_url = null;
    let image_path = null;

    try {
        if (req.file) {
            image_url = await storageService.uploadImage(req.file);
            image_path = image_url.substring(image_url.indexOf("products/"));
        }
    } catch (error) {
        return next(error);
    }

    try {
        const product = await productsService.createProduct(req.body, image_path);
        res.status(201).json(product);
    } catch (error) {
        if (image_url) {
            await storageService.deleteImage(image_url).catch(() => {});
        }
        next(error);
    }
};

export const readProduct = async (req, res, next) => {
    try {
        const { nombre, autor, editorial, tipo, categoria } = req.query;
        const products = await productsService.readProduct({ nombre, autor, editorial, tipo, categoria });
        res.status(200).json({ data: products });
    } catch (error) {
        next(error);
    }
}

export const readProductById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await productsService.readProductById(id);
        res.status(200).json({data: product});
    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const {id} = req.params;
        const { nombre, id_autor, existencias, fecha_publicacion, imagen, id_editorial, id_tipo, id_categoria } = req.body;
        const product = await productsService.updateProduct(id, { nombre, id_autor, existencias, fecha_publicacion, id_editorial, id_tipo, id_categoria });
        res.status(200).json({ data: product });
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await productsService.deleteProduct(id);
        res.status(200).json({data: product});
    } catch (error) {
        next(error);
    }
}