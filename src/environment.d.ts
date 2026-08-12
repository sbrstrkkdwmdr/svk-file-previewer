declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            TIMER: number;
        }
    }
}

export {};
