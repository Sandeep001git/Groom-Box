import { DataTypes, Sequelize } from 'sequelize';
import { dbConnection } from '@/db_config/dbConnection';
import { UserModelType } from '@/types/TableTypes';

let User: ReturnType<typeof defineUserModel> | null = null;

const defineUserModel = (sequelize: Sequelize) => {
    return sequelize.define<UserModelType>(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            forgottenToken: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            forgottenTokenExpiry: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: 'users',
            timestamps: true,
        }
    );
};

export const initializeUserModel = async () => {
    if (User) {
        return User;
    }

    try {
        const sequelize = await dbConnection();
        if (!sequelize) {
            throw new Error('Sequelize instance is not initialized.');
        }

        User = defineUserModel(sequelize);
        await User.sync({ force: false });
        return User;
    } catch (error) {
        console.error('Error initializing User model:', error);
        throw error;
    }
};

export default initializeUserModel;
