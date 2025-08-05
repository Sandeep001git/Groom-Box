import { dbConnection } from "@/db_config/dbConnection";
import { initializeRoomModels } from "@/models/Room.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    dbConnection()
    const queryParams = request.nextUrl
    const id = queryParams.searchParams.get('id')

    try {
        const Room = await initializeRoomModels()
        const userRoom = await Room.findOne({
            where:{id:id}
        })
        if(!userRoom){
            return NextResponse.json({
                sucess:false,
                message:"Error joining the room"
            })
        }
        return NextResponse.json({
            sucess:true,
            message:"Room featched succesfully",
            data:userRoom
        })
    } catch (error) {
        return NextResponse.json({
            sucess:false,
            message:"Internal server error"
        })
    }
}