import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { AccountService } from "../services/account.service";
import { AccountDto } from "../../domain/dtos/accounts/account.dto";

export class AccountsController {

    //inyección de dependencias
    constructor(public readonly accountService: AccountService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        };
        console.log("Error", `${error}`);
        throw res.status(500).json({ error: "Internal Server Error" });
    }

    createAccount = (req: Request, res: Response) => {
        const body = req.body;
        const [error, accountDto] = AccountDto.create(body)
        if (error) return res.status(400).json(error)


        this.accountService.createAccount(accountDto!).then((account) => res.json(account)).catch(error => this.handleError(error, res));
    }

    getAccounts = (req: Request, res: Response) => {

    }

    deleteAccountById = (req: Request, res: Response) => {

    }

    updateAccount = (req: Request, res: Response) => {

    }



}