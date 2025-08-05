import ApiMessage from '@/types/ApiMessage'

export class ApiError extends Error {
    success: boolean
    message: string
    stack?: string | undefined
    description?: string

    constructor({ success, message, description }: ApiMessage) {
        super()
        this.success = success
        this.message = message
        this.description = description

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


