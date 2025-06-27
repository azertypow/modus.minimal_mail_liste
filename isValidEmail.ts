export function isValidEmail(email: unknown): boolean {

    if(typeof email !== 'string') return false

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}
