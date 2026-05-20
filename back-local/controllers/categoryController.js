import * as categoryService from '../services/categoryService.js';

export const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}


export const readCategory = async (req, res, next) => {
    try {
        const data = req.body;
        const category = await categoryService.readCategory(data);
        res.status(200).json({ data: category })
    } catch (error) {
        next(error);
    }
}

export const readCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id);
        const category = await categoryService.readCategoryById(id);
        res.status(200).json({ data: category })
    } catch (error) {
        next(error);
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const category = await categoryService.updateCategory(id, { nombre });
        res.status(200).json({ data: category })
    } catch (error) {
        next(error);
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const {id} = req.params;
        const category = await categoryService.deleteCategory(id);
        res.status(200).json({data: category});
    } catch (error) {
        next(error);
    }
}