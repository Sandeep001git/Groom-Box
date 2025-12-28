import { initializeUserInRoomModels } from '@/models/UserRoom.model';
import { initializeRoomModels } from '@/models/Room.model';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    _request: NextRequest,
    { params }: { params: { roomId: string; socketId: string } }
) {
    const { roomId, socketId } = params;

    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const Room = await initializeRoomModels();
        const UserInRoom = await initializeUserInRoomModels();
        if (!Room || !UserInRoom) {
            throw new Error('Failed to initialize models.');
        }

        const isRoomAvailable = await Room.findOne({ where: { id : roomId } });
        if (!isRoomAvailable) {
            return NextResponse.json(
                { success: false, message: 'No Room exists with that ID' },
                { status: 404 }
            );
        }

        const userRoom = await UserInRoom.findOne({
            where: { userId: session.user.id },
        });
        if (!userRoom) {
            return NextResponse.json(
                { success: false, message: 'User not found in any room' },
                { status: 404 }
            );
        }

// @ts-expect-error
        if (userRoom.isBanned) {
            return NextResponse.json(
                { success: false, message: 'User is banned from this group' },
                { status: 403 }
            );
        }

        await userRoom.update({
            socket_id: socketId,
        });

        return NextResponse.json(
            { success: true, message: 'You have joined the room' },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
