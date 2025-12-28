import { initializeUserInRoomModels } from '@/models/UserRoom.model'
import { ApiError } from '@/utils/ApiError'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
    const session = await getServerSession()

    const { socketId, roomId } = await request.json()

    if (!socketId || !roomId) {
        return NextResponse.json(
            { success: false, message: 'Missing socketId or roomId' },
            { status: 400 }
        )
    }
    try {
        const UserInRoom = await initializeUserInRoomModels()
        if (!UserInRoom) {
            return NextResponse.json(
                { success: false, message: 'Model initialization failed' },
                { status: 500 }
            )
        }
        const user = await UserInRoom.findOne({
            where: {
                userId: session?.user.id,
                roomId,
            },
        })
        if (!user)
            return NextResponse.json(
                { success: false, message: 'User not in this room' },
                { status: 403 }
            )
        await user.update({
            roomId: roomId,
            socket_id: socketId,
            isAdmin: true,
        })

        return NextResponse.json(
            { success: true, message: 'User room updated successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
