import * as R from "ramda";

const {type, is, isEmpty} = window.R;

export function isDevMode() {
    return validateEnvMode()
}

export function validateEnvMode(value = "development", key = 'NODE_ENV') {
    if (!process
        || !process.env
        || !process.env[key]) return false;
    return (process.env[key] == value)
}
