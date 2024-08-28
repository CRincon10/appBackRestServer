import { PrismaClient } from "@prisma/client";
import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { AccountModel } from "../../data/mongo/models/account.model";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { ILoginUser, ISocialPayload } from "../auth/controller";
import { EmailService, SendMailOptions } from "./email.service";
import { OAuth2Client } from "google-auth-library";

export class AuthService {
    //DI
    constructor(private readonly emailService?: EmailService) { }

    private readonly googleClient = new OAuth2Client(envs.GOOGLE_CLIENT_ID);

    public async registerUser(registerDto: RegisterUserDto) {
        const userPrisma = new PrismaClient().user.findUnique({ where: { email: registerDto.email } });

        if(!userPrisma) {
            console.log("No existe el usuario en la base de datos de Prisma");
        }


        console.log("object", userPrisma);

        const existUser = await UserModel.findOne({ email: registerDto.email });
        if (existUser) throw CustomError.badRequestResult("Ya existe un usuario con este Email");
        if (registerDto.accountId) {
            const existAccount = await AccountModel.findById(registerDto.accountId);
            if (!existAccount) throw CustomError.badRequestResult(`La cuenta con el accountId: ${registerDto.accountId}, no existe`);
        };

        try {
            const user = new UserModel({
                ...registerDto,
                password: await bcryptAdapter.hash(registerDto.password),
            });

            const sendEmailValidate = await this.sendEmailAndValidateLink(user.email);
            if (!sendEmailValidate) throw CustomError.internalServer("Error interno");

            await user.save();

            const { password, ...userEntity } = UserEntity.createObjectUser(user);

            const token = await JwtAdapter.generateToken({ userId: user.id });
            if (!token) throw CustomError.internalServer("Error al intentar guardar JWT");

            return {
                accountUser: userEntity,
                token,
            };
        } catch (err) {
            throw CustomError.internalServer(`${err}`);
        };
    }

    public async loginUser(loginUser: ILoginUser) {
        const { email, password } = loginUser;
        const user = await UserModel.findOne({ email: email });

        if (!user) throw CustomError.badRequestResult("Usuario o contraseña inválidos");
        const passwordMatch = bcryptAdapter.compare(password, user.password);
        if (!passwordMatch) throw CustomError.badRequestResult("Usuario o contraseña inválidos");

        const { password: userPassword, ...userEntity } = UserEntity.createObjectUser(user);

        const token = await JwtAdapter.generateToken({ userId: userEntity.id });

        if (!token) throw CustomError.internalServer("Error al intentar guardar JWT"); //el JWt siempre devuelve algo

        return {
            accountUser: userEntity,
            token,
        };
    } 

    public async socialLogin(socialPayload: ISocialPayload) {
        const { providerName, tokenId, email } = socialPayload;

        try {
            if (providerName === 'google') {
                const ticket = await this.googleClient.verifyIdToken({
                    idToken: tokenId,
                    audience: envs.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload || payload.email !== email) {
                    throw CustomError.badRequestResult('Invalid token or email mismatch');
                }
            } else {
                throw CustomError.badRequestResult('Unsupported provider');
            }

            // Verificar si el usuario existe en la base de datos
            let user = await UserModel.findOne({ email: email });
            if (!user) {
                // Si el usuario no existe, crear uno nuevo
                user = new UserModel({
                    email,
                    // Otros campos que necesites
                });
                await user.save();
            }

            // Crear un objeto de usuario sin la contraseña
            const { password, ...userEntity } = UserEntity.createObjectUser(user);

            // Generar token de autenticación
            const token = await JwtAdapter.generateToken({ userId: userEntity.id });

            if (!token) throw CustomError.internalServer('Error al intentar generar JWT');

            return {
                accountUser: userEntity,
                token
            };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServer(`Authentication failed: ${error}`);
            }
        }
    }

    private async sendEmailAndValidateLink(email: string) {
        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer("Error al intentar guardar JWT");

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const htmlBody = `
            <h1>Construir body para el mensaje de validacion de creacion de usuario en la aplicacion</h1>
            <p>Haz clic en el boton de validacion para confirmar tu email</p>
            <a href="${link}">Valida tu email: ${email}</a>
        `;

        const options: SendMailOptions = {
            to: email,
            subject: "Verificación de email requerida",
            htmlBody,
        };

        const isSent = this.emailService && (await this.emailService.sendEmail(options));
        if (!isSent) throw CustomError.internalServer("Error al enviar en correo de verificación, es posible que el correo no exista");
        return true;
    }

    public validateEmailToken = async (token: string) => {
        const payload = await JwtAdapter.validateToken<{ email: string }>(token);
        if (!payload) throw CustomError.unauthorized("Invalid token");

        const { email } = payload;
        if (!email) throw CustomError.badRequestResult("Email no existe en el token");

        const accountUser = await UserModel.findOne({ email });
        if (!accountUser) throw CustomError.badRequestResult("Usuario no se encontró en la base de datos");

        accountUser.emailValidated = true;
        await accountUser.save();
        return true;
    };
}