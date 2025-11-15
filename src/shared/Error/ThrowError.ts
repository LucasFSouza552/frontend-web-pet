export class ThrowError extends Error {
    public readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    public static badRequest(message: string) {
        return new ThrowError(400, message);
    }

    public static notFound(message: string) {
        return new ThrowError(404, message);
    }

    public static conflict(message: string) {
        return new ThrowError(409, message);
    }

    public static internal(message: string) {
        return new ThrowError(500, message);
    }

    public static unauthorized(message: string) {
        return new ThrowError(401, message);
    }

    public static forbidden(message: string) {
        return new ThrowError(403, message);
    }

    public static paymentRequired(message: string) {
        return new ThrowError(402, message);
    }

    public static tooManyRequests(message: string) {
        return new ThrowError(429, message);
    }
}