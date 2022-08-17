// Express Error Handler
class ExpressError extends Error{
    constructor(message,statusCode) {
        super(); // Error Constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;