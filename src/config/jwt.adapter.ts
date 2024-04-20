import jwt from "jsonwebtoken";
import { envs } from "./envs";

const jwt_Seed = envs.JWT_SEED;

export class JwtAdapter {

    static generateToken = (payload: any, duration: string = "2h") => {
        return new Promise((resolve) => {
            jwt.sign(payload, jwt_Seed, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                resolve(token);
            });

        });
    };


    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, jwt_Seed, (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded as T);
            });
        })
    }
}

