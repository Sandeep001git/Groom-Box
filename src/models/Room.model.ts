import { DataTypes, Sequelize } from 'sequelize';
import { dbConnection } from '@/db_config/dbConnection';
import { initializeUserModel } from './User.model';

let Room: ReturnType<typeof defineRoom> | null = null;

function defineRoom(sequelize: Sequelize) {
    return sequelize.define(
        'Room',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            adminId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'users', // ensure this is the correct model name
                    key: 'id',
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isPrivate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            tableName: 'rooms',
            timestamps: true,
        }
    );
}

export async function initializeRoomModels() {
    try {
        const sequelize = await dbConnection();
        if (!sequelize) {
            throw new Error('Failed to initialize Sequelize instance.');
        }

        const userModel = await initializeUserModel();
        Room = defineRoom(sequelize);

        Room.belongsTo(userModel, {
            foreignKey: 'adminId',
            as: 'admin',
        });

        await Room.sync({ force: false });
        console.log('Models initialized successfully.');
        return Room;
    } catch (error) {
        console.error('Error initializing models:', error);
        throw error;
    }
}
