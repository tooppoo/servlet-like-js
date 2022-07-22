
export class BaseError extends Error {
    constructor(message: string) {
        super(message);

        Object.defineProperty(this, 'name', {
            configurable: true,
            enumerable: false,
            value: this.constructor.name,
            writable: true,
        });

        Error.captureStackTrace(this, this.constructor);
    }
}
