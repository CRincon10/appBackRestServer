import { Request, Response } from "express";
import { CustomError, PaginationDto, RegisterUserDto } from "../../domain";
import { AccountService } from "../services/account.service";
import { AccountDto } from "../../domain/dtos/accounts/account.dto";
import { UserService } from "../services/user.service";
import { UpdateStatusUserDto, RequestGetUsersDto } from "../../domain/dtos/shared/requests/users.request.dto";

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
        const [error, userDto] = RegisterUserDto.createUser(body)
        if (error) return res.status(400).json(error)


        this.userService.createUpdateUser(userDto!).then((user) => res.json(user)).catch(error => this.handleError(error, res));
    }

    getUsers = (req: Request, res: Response) => {
        const body = req.body;
        const [errorRequest, request] = RequestGetUsersDto.create(body);
        if (errorRequest) return res.status(400).json(errorRequest);
        const [error] = PaginationDto.createPagination(request!.page, request!.pageSize);
        if (error) return res.status(400).json(error);

        this.userService.getUsers(request!).then((users) => res.json(users)).catch(error => this.handleError(error, res));

    }

    changeStatusById = (req: Request, res: Response) => {
        const body = req.body;
        const [errorRequest, request] = UpdateStatusUserDto.create(body);
        if (errorRequest) return res.status(400).json(errorRequest);
        this.userService.changeUserStatus(request!).then((user) => res.json(user)).catch(error => this.handleError(error, res));
    }

    updateUser = (req: Request, res: Response) => {

    }



}