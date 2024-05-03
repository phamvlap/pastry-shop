import { UnauthorizedError } from './../errors/index.js';

export default (req, res, next) => {
    if (req.staff.staff_role.toUpperCase() !== process.env.ADMIN_ROLE_NAME) {
        return next(new UnauthorizedError('Unauthorized admin.'));
    }
    return next();
};
