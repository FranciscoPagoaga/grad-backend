declare global {
    namespace NodeJS{
        interface ProcessEnv{
            MONGO_CONNECTION_STRING: string
            PORT: number
            JWT_SECRET: string
        }
    }
}
