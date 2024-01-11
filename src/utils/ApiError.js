class ApiError extends Error {
    constructor(
        statusCode,
        message= "something went wrong",
        error = [],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors 
        if (this.stack) {
           this.stack = statck 
        } else{
            error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}