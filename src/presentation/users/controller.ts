import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AccountService } from "../services/account.service";
import { AccountDto } from "../../domain/dtos/accounts/account.dto";
import { UserService } from "../services/user.service";

export class UserController {

    //inyección de dependencias
    constructor(public readonly userService: UserService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        };
        console.log("Error", `${error}`);
        throw res.status(500).json({ error: "Internal Server Error" });
    }

    createUser = (req: Request, res: Response) => {
        const body = req.body;
        const [error, userDto] = RegisterUserDto.create(body)
        if (error) return res.status(400).json(error)


        this.userService.createUser(userDto!).then((account) => res.json(account)).catch(error => this.handleError(error, res));
    }

    getUsers = (req: Request, res: Response) => {

    }

    deleteAccountById = (req: Request, res: Response) => {

    }

    updateAccount = (req: Request, res: Response) => {

    }



}