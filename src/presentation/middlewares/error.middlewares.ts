import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            data: {
                message: err.data.message
            }
        });
    } else {
        // Error no manejado por CustomError
        res.status(500).json({
            data: {
                message: 'Hubo un error desconocido'
            }
        });
    }
};

export default errorMiddleware;
