export interface City {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
}

export interface State {
    id: number;
    name: string;
    state_code: string;
    latitude: string;
    longitude: string;
    country_id: number;
}

export enum TypeRegister {
    USER = "USER",
    ORGANIZATION = "ORGANIZATION",
    ACCOUNT_ENTERPRISE = "ACCOUNT_ENTERPRISE",
}

export const TypeRegisterList: TypeRegister[] = [TypeRegister.USER, TypeRegister.ORGANIZATION, TypeRegister.ACCOUNT_ENTERPRISE];

export enum UserDocumentType {
    CC = "Cédula ciudadanía",
    NIT = "Nit",
    CE = "Cédula extranjería",
    PP = "Pasaporte",
}
