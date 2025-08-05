import { initializeRoomModels } from '@/models/Room.model'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const offset = (page - 1) * limit

    const Rooms = await initializeRoomModels()
    const publicRooms = await Rooms.findAll({
      offset,
      limit,
    })

    return NextResponse.json({
      success: true,
      message: 'Public rooms fetched',
      data: publicRooms.length > 0 ? publicRooms : [],
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    })
  }
}
