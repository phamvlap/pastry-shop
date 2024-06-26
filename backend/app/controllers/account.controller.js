import { StatusCodes } from 'http-status-codes';
import { AccountModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';

class AccountController {
    async index(req, res, next) {
        try {
            const accountModel = new AccountModel();
            const accounts = await accountModel.getAll();
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: accounts,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
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
    async forgotPassword(req, res, next) {
        try {
            const accountModel = new AccountModel();
            const account = await accountModel.forgotPassword(req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: account,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async sendCode(req, res, next) {
        try {
            const accountModel = new AccountModel();
            await accountModel.sendCode(req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: 'Send code successfully',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async verifyCode(req, res, next) {
        try {
            const accountModel = new AccountModel();
            const account = await accountModel.verifyCode(req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: account,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async resetPassword(req, res, next) {
        try {
            const accountModel = new AccountModel();
            await accountModel.resetPassword(req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: 'Reset password successfully',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new AccountController();
