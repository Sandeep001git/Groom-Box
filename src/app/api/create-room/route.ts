import { ApiError } from '@/utils/ApiError'
import { initializeRoomModels } from '@/models/Room.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const { adminId, name, isPrivate } = await request.json()
    try {
        const Room = await initializeRoomModels()
        if (!Room) {
            throw new Error('Failed to initialize Room instance.')
        }
        const isRoomNameTaken = await Room.findOne({ where: { name: name } })
        console.log(isRoomNameTaken)
        if (isRoomNameTaken) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Room name is already taken.',
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }
        const room = await Room.create({
            adminId: adminId,
            name: name,
            isPrivate: isPrivate,
        })
        if (!room) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Failed to create room.',
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

        return new Response(JSON.stringify(room), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error(error)
        return new Response(
            JSON.stringify(
                new ApiError({
                    success: false,
                    message: 'Error creating the room',
                })
            ),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}
