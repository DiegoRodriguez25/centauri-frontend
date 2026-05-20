import * as typeService from '../services/typeService.js'

export const createType = async (req, res, next) => {
    try{
        const type = await typeService.createType(req.body);
        res.status(201).json(type);
    } catch (error) {
        next(error);
    }
}

export const readType = async (req, res, next) => {
    try {
        const data = req.body;
        const type = await typeService.readType(data);
        res.status(200).json({ data: type })
    } catch (error) {
        next(error);
    }
}

export const readTypeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const type = await typeService.readTypeById(id);
        res.status(200).json({ data: type })
    } catch (error) {
        next(error);
    }
}

export const updateType = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const type = await typeService.updateType(id, { nombre });
        res.status(200).json({ data: type })
    } catch (error) {
        next(error);
    }
}

export const deleteType = async (req, res, next) => {
    try {
        const {id} = req.params;
        const type = await typeService.deleteType(id);
        res.status(200).json({data: type});
    } catch (error) {
        next(error);
    }
}
