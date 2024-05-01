import { UnauthorizedError } from './../errors/index.js';

export default (req, res, next) => {
    if (req.staff.staff_role !== 'ADMIN') {
        return next(new UnauthorizedError('Unauthorized admin.'));
    }
    return next();
};
