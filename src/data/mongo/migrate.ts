import mongoose from "mongoose";
import { MongoDataBase } from "./mongo-database";
import { envs } from "../../config";
import { UserModel } from "..";

async function migrate(modelName: string, field: Record<string, any>) {
    if (!mongoose.modelNames().includes(modelName)) {
        throw new Error(`Modelo ${modelName} no está registrado en Mongoose.`);
    }
    const Model = mongoose.model(modelName);
    try {
        const result = await Model.updateMany({}, { $set: field });
        console.log("Documentos actualizados:", result);
    } catch (error) {
        console.error("Error durante la migración:", error);
    }
};

async function removeField(modelName: string, fieldName: string) {
    if (!mongoose.modelNames().includes(modelName)) {
        throw new Error(`Modelo ${modelName} no está registrado en Mongoose.`);
    }

    const Model = mongoose.model(modelName);

    try {
        const result = await Model.updateMany({}, { $unset: { [fieldName]: "" } });
        console.log("Documentos actualizados:", result);
    } catch (error) {
        console.error("Error durante la migración:", error);
    }
}

async function main() {
    await MongoDataBase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    //definir el modelo que se va a migrar
    mongoose.model('User', UserModel.schema);

    //Definir el campo que se va a migrar
    await migrate('User', { validationIsOpened: false });

    //Definir el campo que se va a eliminar
    // await removeField('User', 'address');

    mongoose.disconnect();
}

main().catch(console.error);
