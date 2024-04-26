import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { EmailService, SendMailOptions } from './email.service';
import jwt from 'jsonwebtoken';

export class AuthService {
    //DI
    constructor(
        private readonly emailService: EmailService
    ) { }

    public async registerUser(registerDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerDto.email });
        if (existUser) throw CustomError.badRequestResult("Ya existe un usuario con este Email");

        try {
            const user = new UserModel(registerDto);
            user.password = bcryptAdapter.hash(registerDto.password);
            user.dateCreated = new Date();

            await user.save();

            const sendEmailValidate = await this.sendEmailAndValidateLink(user.email);
            if(!sendEmailValidate) throw CustomError.internalServer("Error al intentar enviar correo de validación")

            const { password, ...userEntity } = UserEntity.createObjectUser(user);

            const token = await JwtAdapter.generateToken({ userId: user.id });
            if (!token) throw CustomError.internalServer("Error al intentar guardar JWT")

            //devuelve el objeto sin la contraseña
            return {
                user: userEntity,
                token
            };

        } catch (err) {
            throw CustomError.internalServer(`${err}`)
        }
    }

    public async loginUser(loginUser: LoginUserDto) {
        const { email, password } = loginUser;
        const user = await UserModel.findOne({ email: email })

        if (!user) throw CustomError.badRequestResult("Usuario o contraseña inválidos");
        const passwordMatch = bcryptAdapter.compare(password, user.password)
        if (!passwordMatch) throw CustomError.badRequestResult("Usuario o contraseña inválidos");

        const { password: userPassword, ...userEntity } = UserEntity.createObjectUser(user);

        const token = await JwtAdapter.generateToken({ userId: userEntity.id });

        if (!token) throw CustomError.internalServer("Error al intentar guardar JWT"); //el JWt siempre devuelve algo

        return {
            user: userEntity,
            token
        };
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
            htmlBody
        };

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer("Error al enviar en correo de verificación");
        return true;
    }

    public validateEmailToken = async(token: string) => {
        const payload = await JwtAdapter.validateToken<{ email: string }>(token);
        if ( !payload ) throw CustomError.unauthorized('Invalid token');

        const { email } = payload;
        if (!email) throw CustomError.badRequestResult("Email no existe en el token");

        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.badRequestResult("Usuario no se encontró en la base de datos");

        user.emailValidated = true;
        await user.save();
        return true;

    }
}