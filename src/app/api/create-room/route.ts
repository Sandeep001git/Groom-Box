import { initializeRoomModels } from '@/models/Room.model';
import { ApiError } from '@/utils/ApiError';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { adminId, name, isPrivate } = await request.json();

    try {
        const Room = await initializeRoomModels();
        if (!Room) {
            throw new Error('Failed to initialize Room instance.');
        }

        const isRoomNameTaken = await Room.findOne({ where: { name } });
        if (isRoomNameTaken) {
            return NextResponse.json(
                { success: false, message: 'Room name is already taken.' },
                { status: 400 }
            );
        }
        console.log(adminId)
        const room = await Room.create({ adminId, name, isPrivate });
        console.log(room)
        return NextResponse.json(room, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            new ApiError({ success: false, message: 'Error creating the room' }),
            { status: 500 }
        );
    }
}
