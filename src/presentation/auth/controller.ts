import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { DiscordService } from "../services/discord.service";


export class AuthController {

    constructor(public readonly authService: AuthService, private readonly discordService: DiscordService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        };
        console.log("Error", `${error}`);
        throw res.status(500).json({ error: "Internal Server Error" });
    }

    registerUser = (req: Request, res: Response) => {
        const body = req.body;
        const [error, registerDto] = RegisterUserDto.create(body)
        if (error) return res.status(400).json({error})

        this.authService.registerUser(registerDto!).then((user) => res.json(user)).catch(error => this.handleError(error, res));
    }

    loginUser = (req: Request, res: Response) => {
        const body = req.body;
        const [error, loginUserDto] = LoginUserDto.create(body)
        if (error) return res.status(400).json(error)
        this.authService.loginUser(loginUserDto!)
            .then((resp) => {
                res.json(resp);
                return this.discordService.notify(`Nuevo usuario registrado ${resp.user.name} ${resp.user.lastName} `);
            })
            .catch(error => this.handleError(error, res));
    }

    validateEmailUser = (req: Request, res: Response) => {
        const { token } = req.params;

        this.authService.validateEmailToken(token)
            .then(() => res.json("Email validated"))
            .catch(error => this.handleError(error, res));
    }

}