import { Sequelize } from "sequelize";
import config from "@/config/config";

let sequelize:Sequelize | undefined;
export async function dbConnection (){
    try {
        if(!sequelize){
            // await sequelize.sync()
            const env = process.env.NODE_ENV || "development";
            const dbConfig = config[env];
            
            sequelize = new Sequelize(
                dbConfig.database,
                dbConfig.username,
                dbConfig.password,
                {
                    dialect: dbConfig.dialect ?? "mysql",
                    dialectModule: dbConfig.dialectModule ?? undefined,
                }
            );
            
            await sequelize.authenticate();
            await sequelize.sync({ alter: true });
            console.log("Connection has been established successfully.");
        }
        return sequelize
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
