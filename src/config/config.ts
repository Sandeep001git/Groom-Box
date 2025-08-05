import mysql  from 'mysql2';

interface DbConfig {
    database: string;
    host:string;
    username: string;
    password: string;
    dialect: 'mysql' | 'postgres' | 'sqlite'; 
    dialectModule?: any; 
    storage?:any
}
const config:Record<string,DbConfig> = {
    development: {
        dialect: "mysql",
        dialectModule:mysql,
        host: process.env.DB_HOST || "",
        username: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
    },
    duction: {
        dialect: "postgres",
        // dilectModule:mysql,
        host: process.env.DB_HOST || '',
        username: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || '',
        // Additional options can be added here
    },
};

export default config;
