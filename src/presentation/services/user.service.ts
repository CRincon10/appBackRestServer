import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { AccountModel } from "../../data/mongo/models/account.model";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { RequestGetUsersDto, UpdateStatusUserDto } from "../../domain/dtos/shared/requests/users.request.dto";
import { EmailService, SendMailOptions } from "./email.service";
import { RolesEnum, RolesList, validateUserSuperAdmin } from "./helper";

export class UserService {

    constructor(private readonly emailService: EmailService) { }

    private readonly authorizedAccountRoles = [RolesEnum.USER_OWNER_ACCOUNT, RolesEnum.ADMIN_ACCOUNT];
    private readonly authorizedOrganizationRoles = [RolesEnum.USER_OWNER_ORGANIZATION, RolesEnum.ADMIN_ORGANIZATION];

    public async createUpdateUser(userDto: RegisterUserDto) {
        try {
            // Verificar si estamos creando o actualizando
            const isUpdate = !!userDto.id;

            const [existUser, existAccount, existUserCreator] = await Promise.all([
                isUpdate ? UserModel.findById(userDto.id) : UserModel.findOne({ email: userDto.email }),
                AccountModel.findById(userDto.accountId),
                UserModel.findById(userDto.userCreatorId)
            ]);

            if (!existAccount) {
                throw CustomError.badRequestResult(`La cuenta con el accountId: ${userDto.accountId} no existe`);
            }

            if (isUpdate) {
                // Actualización de usuario
                if (!existUser) {
                    throw CustomError.badRequestResult(`El usuario con el id: ${userDto.id} no existe`);
                }

                // Actualizar los campos necesarios del usuario
                existUser.email = userDto.email;
                existUser.accountId = userDto.accountId;
                existUser.organizationId = userDto.organizationId;
                existUser.documentIdentificationType = userDto.documentIdentificationType;
                existUser.documentIdentificationNumber = userDto.documentIdentificationNumber;
                existUser.organizationId = userDto.organizationId;
                existUser.phoneNumber = userDto.phoneNumber;
                existUser.firstName = userDto.firstName;
                existUser.lastName = userDto.lastName;
                existUser.roles = userDto.roles;

                if (userDto.password) {
                    existUser.password = await bcryptAdapter.hash(userDto.password);
                }
                // Otros campos que pueden necesitar actualización
                existUser.updatedAt = new Date();

                await existUser.save();

                const { password, id, ...userEntity } = UserEntity.createObjectUser(existUser);

                return { accountUser: userEntity };

            } else {
                // Creación de usuario
                if (existUser && existUser.accountId === userDto.accountId) {
                    throw CustomError.badRequestResult(`El E-mail ${userDto.email} ya existe en esta cuenta`);
                }

                if (!existUserCreator) {
                    throw CustomError.badRequestResult("Usuario creador no encontrado");
                }

                const accountUser = new UserModel({
                    ...userDto,
                    password: await bcryptAdapter.hash(userDto.password)
                });

                const sendEmailValidate = await this.sendEmailAndValidateLink(accountUser.email);
                if (!sendEmailValidate) {
                    throw CustomError.internalServer("Error interno al enviar el correo electrónico de validación");
                }

                await accountUser.save();

                const { password, id, ...userEntity } = UserEntity.createObjectUser(accountUser);

                return { accountUser: userEntity };
            }
        } catch (err) {
            throw CustomError.internalServer(`Error en la creación/actualización del usuario: ${err}`);
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
            htmlBody
        };

        const isSent = this.emailService && await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer("Error al enviar en correo de verificación, es posible que el correo no exista");
        return true;
    };

    public async getUsers(request: RequestGetUsersDto) {
        const { page, pageSize, requestUserId, accountId, organizationId } = request;

        let filter: any = {};
        if (accountId) filter.accountId = accountId;
        if (organizationId) filter.organizationId = organizationId;

        try {
            const [totalItems, userRequest, accountUsers] = await Promise.all([
                UserModel.countDocuments(),
                UserModel.findById(requestUserId),
                UserModel.find(filter).skip((page - 1) * pageSize).limit(pageSize),
            ]);

            if (!accountUsers) throw CustomError.badRequestResult("No se encontraron usuarios");

            if (!userRequest) {
                throw CustomError.badRequestResult("Usuario que realiza la consulta no existe");
            } else if (userRequest) {
                if (!accountId && !organizationId) {
                    const userIsAdmin = validateUserSuperAdmin(userRequest.roles);
                    if (!userIsAdmin) throw CustomError.unauthorized("Usuario no autorizado para realizar esta acción");
                }
                if (accountId) {
                    const userAccountAuthorized = this.authorizedAccountRoles.some(role => userRequest.roles.includes(role));
                    if (!userAccountAuthorized) throw CustomError.unauthorized("Usuario de cuenta no autorizado");
                } else if (organizationId) {
                    const userOrganizationAuthorized = this.authorizedOrganizationRoles.some(role => userRequest.roles.includes(role));
                    if (!userOrganizationAuthorized) throw CustomError.unauthorized("Usuario de organización no autorizado");
                }
            }

            const usersMapped = accountUsers.map((accountUser) => {
                const { password, ...userEntity } = UserEntity.createObjectUser(accountUser)
                return userEntity
            });

            return {
                accountUsers: usersMapped,
                page,
                pageSize,
                items: accountUsers.length,
                totalItems,
                nextPage: page * pageSize < totalItems ? page + 1 : null,
                prevPage: page - 1 > 0 ? page - 1 : null
            };

        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        };
    };

    public async changeUserStatus(dto: UpdateStatusUserDto) {
        try {
            const [targetUser, accountUserRequest] = await Promise.all([
                UserModel.findById(dto.userIdToChangeStatus),
                UserModel.findById(dto.requestUserId)
            ]);

            if (!accountUserRequest) throw CustomError.badRequestResult("Usuario que realiza solicitud no existe.");
            if (!targetUser) throw CustomError.badRequestResult(`Usuario con el Id ${dto.userIdToChangeStatus} no existe.`);
            if (targetUser.id === accountUserRequest.id) throw CustomError.badRequestResult("No puedes desactivar tu usuario");

            const userIsSuperAdmin = validateUserSuperAdmin(accountUserRequest.roles);

            if (!userIsSuperAdmin) {
                if (dto.accountId) {
                    if (this.authorizedAccountRoles.some(role => accountUserRequest.roles.includes(role)))
                        throw CustomError.badRequestResult("Usuario no autorizado para realizar esta acción");
                    if (dto.accountId !== accountUserRequest.accountId)
                        throw CustomError.badRequestResult("Usuario que realiza solicitud no pertenece a esta cuenta");
                    if (dto.accountId !== targetUser.accountId)
                        throw CustomError.badRequestResult(`El Usuario con el Id ${targetUser.id} no pertenece a esta cuenta`);
                } else if (dto.organizationId && targetUser.organizationId) {
                    if (this.authorizedOrganizationRoles.some(role => accountUserRequest.roles.includes(role)))
                        throw CustomError.badRequestResult("Usuario no autorizado para realizar esta acción");
                    if (dto.organizationId !== accountUserRequest.organizationId)
                        throw CustomError.badRequestResult("Usuario que realiza la solicitud no pertenece a esta organización");
                    if (dto.organizationId !== targetUser.organizationId)
                        throw CustomError.badRequestResult(`El Usuario con el Id ${targetUser.id} no pertenece a esta organización`);
                }
            };

            targetUser.status = dto.status;
            await targetUser.save();

            return {
                accountUserUpdated: UserEntity.createSimpleResponseUser(targetUser)
            }

        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        };
    };

    public async getUserById(userId: string) {
        try {
            const accountUser = await UserModel.findById(userId);
            if (!accountUser) throw CustomError.notFound(`User with ID ${userId} not found`);
            const { password, id, ...userEntity } = UserEntity.createObjectUser(accountUser);
            return { accountUser: userEntity };
    
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        };
    }


};