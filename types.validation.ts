import {isValidEmail} from "./isValidEmail.ts";

export function isAPIMailListPost(data: unknown): data is APIMailListPost {
    return (
        typeof data === 'object'
        && data !== null
        && 'email' in data
        && isValidEmail( data.email )
    );
}
