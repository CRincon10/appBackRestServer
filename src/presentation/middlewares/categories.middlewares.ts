import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { mongoIdIsValid } from "../services/helper";

export class CategoriesMiddlewares {
    
    static validateMongoId(req: Request, res: Response, next: NextFunction) {
        const accountId = req.params.accountId;
        console.log("ACC", accountId)
        if(!accountId) return res.status(400).json({ error: "AccountId requerido" });

        const isValid = mongoIdIsValid(accountId)
        if(!isValid) return res.status(400).json({ error: "AccountId invalido" });
        
        next();
    }

    

}