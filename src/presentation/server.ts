import express, { NextFunction, Router } from 'express';
import cors from 'cors'
import path from 'path';
import { CustomError } from '../domain';
import errorMiddleware from './middlewares/error.middlewares';

interface Options {
    port: number;
    routes: Router;
    public_path?: string;
}

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
};

export class Server {

    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.routes = routes;

        //* Configuración de CORS
        if (corsOptions) {
            this.app.use(cors(corsOptions));
        } else {
            // Configuración CORS predeterminada para permitir todas las solicitudes
            this.app.use(cors());
        }
    }

    async start() {
        //* Middlewares
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

        //* Routes
        this.app.use(this.routes);

        // Middleware de Manejo de Errores
        this.app.use(errorMiddleware);

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    public close() {
        this.serverListener?.close();
    }

}
