import { StatusCodes } from 'http-status-codes';

const notFoundHandler = (req, res, next) => {
    return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Resource not found',
    });
};

export default notFoundHandler;
