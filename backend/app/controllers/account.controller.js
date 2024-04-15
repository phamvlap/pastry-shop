import { StatusCodes } from 'http-status-codes';
import { AccountModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';

class AccountController {
    async login(req, res, next) {
        try {
            const accountModel = new AccountModel();
            const account = await accountModel.login(req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: account,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async changePassword(req, res, next) {
        try {
            const accountModel = new AccountModel();
            await accountModel.changePassword(req.params.id, req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: 'Change password successfully',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new AccountController();
