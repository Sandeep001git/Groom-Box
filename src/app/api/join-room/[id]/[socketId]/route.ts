import { initializeUserInRoomModels } from '@/models/UserRoom.model'
import { initializeRoomModels } from '@/models/Room.model'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { RoomType } from '@/types/TableTypes'

export async function GET(request: NextApiRequest, res: NextApiResponse) {
    const { roomId, socketId } = await request.query
    console.log(roomId)
    const session = await getServerSession()
    try {
        const Room = await initializeRoomModels()
        const UserInRoom = await initializeUserInRoomModels()
        if (!Room || !UserInRoom) {
            throw new Error('Failed to initialize User In Room instance.')
        }
        const isRoomAvaliable:RoomType | null = await Room.findOne({
            where: { roomId: roomId },
        })  
        if (!isRoomAvaliable) {
            return Response.json({
                sucess: false,
                message: 'No Room existed with Id ',
            })
        }
        console.log(isRoomAvaliable)
        const roomName = isRoomAvaliable.name
        const userRoom = await UserInRoom.findOne({
            where: { userId: session?.user.id },
        })
        console.log(userRoom)
        if (!userRoom) {
            return res.status(401).json({
                sucess: false,
                message: 'No User is not existed',
            })
        }
        if(userRoom.isBanned){
            return res.status(201).json({
                sucess: false,
                message: 'User is banned from the group',
            })
        }
        const updateUserRoom = await userRoom.update({
            name: roomName,
            roomId: roomId,
            socket_id: socketId,
            isAdmin: false,
        })

        if(updateUserRoom){
            return res.status(200).json({
                sucess: true,
                message: 'You have joined the room',
            })
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal Server Error' })
    }
}
