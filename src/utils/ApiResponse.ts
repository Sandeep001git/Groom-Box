import ApiMessage from '@/types/ApiMessage'

export class ApiResponse implements ApiMessage {
    success: boolean
    message: string
    description?: string | undefined
    data?: []

    constructor({ success, message, description, data }: ApiMessage) {
        this.success = success
        this.message = message
        this.description = description
        this.data = data
    }
}
