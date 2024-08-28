import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { DiscordService } from "../services/discord.service";

export interface ISocialPayload {
    providerName: string;
    tokenId: string;
    email: string;
};

export interface ILoginUser {
    email: string,
    password: string,
};

export class AuthController {

    constructor(public readonly authService: AuthService, private readonly discordService: DiscordService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        };
        console.log("Error", `${error}`);
        throw res.status(500).json({ error: "Internal Server Error" });
    };

    registerUser = (req: Request, res: Response) => {
        const body = req.body;
        const [error, registerDto] = RegisterUserDto.createUser(body)
        if (error) return res.status(400).json({error})

        this.authService.registerUser(registerDto!).then((user) => res.json(user)).catch(error => this.handleError(error, res));
    };

    loginUser = (req: Request, res: Response) => {
        const body: ILoginUser = req.body;
        if (!body.email || !body.password) {
            return res.status(400).json({message:"Solicitud invalida faltan campos requeridos"});
        };

        this.authService.loginUser(body)
            .then((resp) => {
                res.json(resp);
                return this.discordService.notify(`Nuevo usuario registrado ${resp.accountUser.firstName} ${resp.accountUser.lastName} `);
            })
            .catch(error => this.handleError(error, res));
    };

    socialLogin = (req: Request, res: Response) => {
        const body: ISocialPayload = req.body;
        if (!body.providerName || !body.tokenId || !body.email) {
            return res.status(400).json({ message: 'Solicitud invalida faltan campos requeridos' });
        };

        this.authService.socialLogin(body)
            .then((resp) => {
                res.json(resp);
                return this.discordService.notify(`Nuevo usuario registrado con ${body.providerName}: ${resp.accountUser.firstName} ${resp.accountUser.lastName}`);
            })
            .catch(error => this.handleError(error, res));
    };

    validateEmailUser = (req: Request, res: Response) => {
        const { token } = req.params;

        this.authService.validateEmailToken(token)
            .then(() => res.json("Email validated"))
            .catch(error => this.handleError(error, res));
    };

};