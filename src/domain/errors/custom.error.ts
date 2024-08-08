export class CustomError extends Error {
    public readonly statusCode: number;
    public readonly data: { message: string };

    private constructor(statusCode: number, data: { message: string }) {
        super(data.message);
        this.data = data;
        this.statusCode = statusCode;
        console.log(this.data)
    }

    static badRequestResult(message: string) {
        const data = { message: message };
        return new CustomError(400, data);
    }

    static unauthorized(message: string) {
        const data = { message: message };
        return new CustomError(401, data);
    }

    static forbidden(message: string) {
        const data = { message: message };
        return new CustomError(403, data);
    }

    static notFound(message: string) {
        const data = { message: message };
        return new CustomError(404, data);
    }

    static internalServer(message: string) {
        console.log("Error", message);
        const data = { message: message };
        return new CustomError(500, data);
    }
};
