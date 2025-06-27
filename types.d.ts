interface APIMailListPost {
    email: string
}

type APIResponse = {
    success: boolean
    error: string | null
    data?: object
}
