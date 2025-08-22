import dotenv from "dotenv"

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production"
}

const loadEnvVariables = () => {
    const requiredEnvVariables: string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
    ];

    requiredEnvVariables.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing require evnironment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL as string
    }
}

export const envVars = loadEnvVariables()