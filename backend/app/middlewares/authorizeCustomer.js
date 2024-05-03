import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './../errors/index.js';

export default (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError('Missing token.'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.customer_id) {
            return next(new UnauthorizedError('Unauthorized customer.'));
        }
        req.customer = {
            ...decoded,
        };
        return next();
    } catch (error) {
        return next(new UnauthorizedError('Invalid token.'));
    }
};
