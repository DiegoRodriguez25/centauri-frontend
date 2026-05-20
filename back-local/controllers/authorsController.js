import * as autorsService from '../services/authorsService.js';

export const createAuthor = async (req, res, next) => {
    try {
        const author = await autorsService.createAuthor(req.body);
        res.status(201).json(author);
    } catch (error) {
        next(error);
    }
};

export const readAuthor = async (req, res, next) => {
    try {
        const data = req.body;
        const author = await autorsService.readAuthor(data);
        res.status(200).json({ data: author })
    } catch (error) {
        next(error);
    }
}

export const readAuthorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const author = await autorsService.readAuthorById(id);
        res.status(200).json({ data: author })
    } catch (error) {
        next(error);
    }
}

export const updateAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const author = await autorsService.updateAuthor(id, { nombre });
        res.status(200).json({ data: author })
    } catch (error) {
        next(error);
    }
}

export const deleteAuthor = async (req, res, next) => {
    try {
        const {id} = req.params;
        const author = await autorsService.deleteAuthor(id);
        res.status(200).json({data: author});
    } catch (error) {
        next(error);
    }
}
