"use client"
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

function MyRooms() {
    const [rooms, setRooms] = useState<[]>([])
    const { data: session } = useSession()

    useEffect(() => {
        async function getMyRoom() {
            const user = session?.user
            try {
                const response = await axios.get(`/api/my-rooms`)
                const data = response.data
                setRooms(data)
            } catch (error) {
                
            }
        }
    })
    return (
        <div>
            <div>My Rooms</div>
            <div>{rooms && rooms.length > 0 ? rooms.map((room,index) => <div key={index}>{room.name}</div>) : 'No rooms found'}</div>
        </div>
    )
}

export default MyRooms
