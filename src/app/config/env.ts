import dotenv from "dotenv"

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    BCRYPT_SALT_ROUND: number
}

const loadEnvVariables = () => {
    const requiredEnvVariables: string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND"
    ];

    requiredEnvVariables.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing require evnironment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND
    }
}

export const envVars = loadEnvVariables()