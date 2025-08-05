import bcrypt from 'bcryptjs'
import initializeUserModel from '@/models/User.model'
import { UserModelType } from '@/types/TableTypes'
import { ApiResponse } from '@/utils/ApiResponse'
import { initializeUserInRoomModels } from '@/models/UserRoom.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { username, email, password } = await req.json() 
    try {
        const User = await initializeUserModel()
        const UserInRoom = await initializeUserInRoomModels()

        if (!User || !UserInRoom) { 
            return NextResponse.json(
                new ApiResponse({
                    success: false,
                    message: 'Model initialization failed',
                    description: 'User or UserInRoom model could not be initialized.',
                }),
                { status: 500 }
            )
        }

        const existingUser = await User.findOne({
            where: { username },
        })

        if (existingUser) {
            return NextResponse.json(
                new ApiResponse({
                    success: false,
                    message: 'Username is taken',
                    description: 'Username is already taken',
                }),
                { status: 400 }
            )
        }

        // Check if email is already taken
        const existingEmail = await User.findOne({
            where: { email },
        })

        if (existingEmail) {
            return NextResponse.json(
                new ApiResponse({
                    success: false,
                    message: 'Email is taken',
                    description: 'Email is already taken',
                }),
                { status: 400 }
            )
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user = await User.create<UserModelType>({
            username,
            email,
            password: hashedPassword,
        })

        if (!user) {
            return NextResponse.json(
                new ApiResponse({
                    success: false,
                    message: 'User creation failed',
                    description: 'Failed to create a new user.',
                }),
                { status: 500 }
            )
        }

        // Create user in room
        const userInRoom = await UserInRoom.create({
            userId: user.id,
        })

        if (!userInRoom) {
            return NextResponse.json(
                new ApiResponse({
                    success: false,
                    message: 'UserInRoom creation failed',
                    description: 'Failed to add user to room.',
                }),
                { status: 500 }
            )
        }

        // Return success response
        return NextResponse.json(user, { status: 200 })

    } catch (error) {
        console.error('Database operation error:', error)
        return NextResponse.json({
            success: false,
            message: 'Database operation failed.',
            description: 'An error occurred while performing the database operation.',
        }, { status: 500 })
    }
}
