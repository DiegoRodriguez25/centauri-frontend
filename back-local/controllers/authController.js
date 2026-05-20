import * as accountService from "../services/accountService.js";

export const login = async (req, res, next) => {
    try {
        const user = await accountService.login(req.body);
        req.session.user = user;
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


export const registro = async (req, res, next) => {
    try {
        const user = await accountService.registro(req.body);
        req.session.user = user.data;
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
