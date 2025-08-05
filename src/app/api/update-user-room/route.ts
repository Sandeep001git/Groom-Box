import { initializeUserInRoomModels } from '@/models/UserRoom.model'
import { ApiError } from '@/utils/ApiError'
import { getServerSession } from 'next-auth'

export async function PUT(request: Request) {
    console.log(request)
    const { socketId, roomId, isAdmin ,name} = await request.json()
    const session = await getServerSession()
    try {
        const UserInRoom = await initializeUserInRoomModels()
        if (!UserInRoom) {
            throw new Error('Failed to initialize User In Room instance.')
        }
        const user = await UserInRoom.findOne({
            where: {
                userId: session?.user.id,
            },
        })
        if (!user) throw new Error('user is not present.???')
        const response = await user.update({
            name: name,
            roomId: roomId,
            socket_id: socketId,
            isAdmin: true,
        })
        if(response){
            return Response.json({
                sucess:true,
                message:"User Room data stored in database "
            })
        }
    } catch (error) {
        return new ApiError({
            success: true,
            message: 'Error creating the room',
        })
    }
}
