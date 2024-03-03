import { StatusCodes } from 'http-status-codes';
import StaffModel from './../models/staff.model.js';
import { BadRequestError } from './../errors/index.js';

class StaffController {
    async index(req, res, next) {
        try {
            const staffModel = new StaffModel();
            const staffs = await staffModel.getAll();
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: staffs,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async getById(req, res, next) {
        try {
            const staffModel = new StaffModel();
            const staff = await staffModel.getById(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: staff,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async login(req, res, next) {
        try {
            const staffModel = new StaffModel();
            const staff = await staffModel.login(req.body.staff_email, req.body.staff_password);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: staff,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async create(req, res, next) {
        try {
            const staffModel = new StaffModel();
            await staffModel.store(req.body);
            return res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: 'Staff added successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        try {
            const staffModel = new StaffModel();
            await staffModel.update(req.params.id, req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Staff updated successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async updatePassword(req, res, next) {
        try {
            const data = {
                staff_password: req.body.staff_password,
                staff_new_password: req.body.staff_new_password,
                staff_confirm_password: req.body.staff_confirm_password,
            }
            const staffModel = new StaffModel();
            await staffModel.changePassword(req.params.id, data);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Password changed successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async delete(req, res, next) {
        try {
            const staffModel = new StaffModel();
            await staffModel.delete(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Staff deleted successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new StaffController();