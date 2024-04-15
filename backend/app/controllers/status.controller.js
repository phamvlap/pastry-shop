import { StatusCodes } from 'http-status-codes';
import { StatusModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';

class StatusController {
    async index(req, res, next) {
        try {
            const statusModel = new StatusModel();
            const status = await statusModel.getAll(req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: status,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new StatusController();
