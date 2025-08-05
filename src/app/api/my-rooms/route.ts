import { initializeRoomModels } from "@/models/Room.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const Rooms = await initializeRoomModels()
        return NextResponse.json({
            sucess:true,
            message:"Rooms featched sucessfully",
            data:Rooms
        })
    } catch (error) {
        return NextResponse.json({
            sucess:false,
            message:"Interval server",
        })
        
    }
}