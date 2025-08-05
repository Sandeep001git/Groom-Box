import { Model, Optional } from 'sequelize';

// Define an interface for the User attributes
export interface UserAttributes {
    id: number| string;
    username?:string;
    email: string;
    password?: string;
    isAdmin?: boolean;
    isVerified?:boolean;
    forgottenToken?: string | null;
    forgottenTokenExpiry?: Date | null;
}

// Define some attributes as optional for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// This will be the type of the User model
export interface UserModelType extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
}


export interface RoomUsers {
    id: number
    userId: number
    title: string
    isBanned: boolean
    roomId: number
}

export interface RoomType {
    id: number
    adminId: number
    name: string
    isPrivate: boolean
}
