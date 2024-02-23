class CustomError extends Error {
    constructor(message, statusCode) {
        super()
        this.message = message
        this.statusCode = statusCode
    }
}

class CustomValidationError extends Error {
    constructor(message, statusCode) {
        super()
        this.message = message.map((item) => {
            const {type, msg, path} = item
            return {type, msg, path}
        })
        this.statusCode = statusCode
    }
}

module.exports = {CustomError, CustomValidationError}