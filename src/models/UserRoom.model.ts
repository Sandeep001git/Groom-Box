import { DataTypes, Sequelize } from 'sequelize'
import { initializeUserModel } from './User.model'
import { initializeRoomModels } from './Room.model'
import { dbConnection } from '@/db_config/dbConnection'

let UserInRoom: ReturnType<typeof defineUserInRoom> | null = null

const defineUserInRoom = (sequelize: Sequelize) => {
    return sequelize.define(
        'UserInRoom',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            socket_id: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'NOT_CONNECTED',
            },
            roomId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'rooms',
                    key: 'id',
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isBanned: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'user_in_room',
            timestamps: true,
        }
    )
}

export async function initializeUserInRoomModels() {
    try {
        const sequelize = await dbConnection()
        if (!sequelize) {
            throw new Error('Failed to initialize Sequelize instance.')
        }

        const userModel = await initializeUserModel()
        if (userModel) {
            const roomModel = await initializeRoomModels()

            UserInRoom = defineUserInRoom(sequelize)

            UserInRoom.belongsTo(userModel, {
                foreignKey: 'userId',
                as: 'user',
            })
            UserInRoom.belongsTo(roomModel!, {
                foreignKey: 'roomId',
                as: 'room',
            })

            await UserInRoom.sync({ force: false })
            console.log('UserInRoom model initialized successfully.')
            return UserInRoom
        }else{
            return
        }
    } catch (error) {
        console.error('Error initializing UserInRoom model:', error)
        throw error
    }
}
