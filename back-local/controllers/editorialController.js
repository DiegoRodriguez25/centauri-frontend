import * as editorialService from '../services/editorialService.js';

export const createEditorial = async (req, res, next) => {
    try{
        const editorial = await editorialService.createEditorial(req.body);
        res.status(201).json(editorial);
    } catch (error) {
        next(error);
    }
}

export const readEditorial = async (req, res, next) => {
    try {
        const data = req.body;
        const editorial = await editorialService.readEditorial(data);
        res.status(200).json({ data: editorial })
    } catch (error) {
        next(error);
    }
}

export const readEditorialById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const editorial = await editorialService.readEditorialById(id);
        res.status(200).json({ data: editorial })
    } catch (error) {
        next(error);
    }
}

export const updateEditorial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const editorial = await editorialService.updateEditorial(id, { nombre });
        res.status(200).json({ data: editorial })
    } catch (error) {
        next(error);
    }
}

export const deleteEditorial = async (req, res, next) => {
    try {
        const {id} = req.params;
        const editorial = await editorialService.deleteEditorial(id);
        res.status(200).json({data: editorial});
    } catch (error) {
        next(error);
    }
}
