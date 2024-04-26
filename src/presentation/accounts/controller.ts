import { Request, Response } from "express";
import { CustomError, PaginationDto, UserEntity } from "../../domain";
import { AccountService } from "../services/account.service";
import { AccountDto } from "../../domain/dtos/accounts/account.dto";
import { DisabledAccountDto } from "../../domain/dtos/shared/requests/account.request.dto";

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


        this.accountService.createAccount(accountDto!)
            .then((account) => res.json({account}))
            .catch(error => this.handleError(error, res));
    };

    getAccounts = (req: Request, res: Response) => {
        const { userId, page = 1, pageSize = 10 } = req.params;
        const [error, paginationDto] = PaginationDto.createPagination(+page, +pageSize)
        if (error) return res.status(400).json({ error })

        this.accountService.getAccounts(paginationDto!, userId)
            .then((accounts) => res.json({accounts}))
            .catch(error => this.handleError(error, res))
    };

    disabledAccount = (req: Request, res: Response) => {
        const [error, body] = DisabledAccountDto.create(req.body);
        if (error) return res.status(400).json({ error })
        
        this.accountService.disabledAccount(body!)
            .then((account) => res.json({account}))
            .catch(error => this.handleError(error, res))
    };

    updateAccount = (req: Request, res: Response) => {

    }



}