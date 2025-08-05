'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

interface Room {
  id: number
  adminId: number
  name: string
  isPrivate: boolean
}

function PublicRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const limit = 20
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function roomsListing() {
      setLoading(true)
      try {
        const response = await axios.get(
          `/api/get-public-rooms?page=${page}&limit=${limit}`
        )

        if (response.data.success === false) {
          toast({ title: response.data.message || 'Failed to load rooms' })
          setRooms([])
        } else {
          setRooms(response.data.data || [])
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error)
          toast({ title: 'Connection Error' })
        } else {
          console.error(error)
        }
        setRooms([])
      } finally {
        setLoading(false)
      }
    }

    roomsListing()
  }, [page, limit, toast])

  return (
    <div>
      <Table>
        <TableCaption>Public Rooms</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading rooms...
              </TableCell>
            </TableRow>
          ) : rooms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No rooms available
              </TableCell>
            </TableRow>
          ) : (
            rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">{room.adminId}</TableCell>
                <TableCell className="text-right">
                  <button className="bg-red-500 px-4 py-2 rounded">
                    Join
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        <Button
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          &lt;
        </Button>
        <span className="mx-4">Page {page}</span>
        <Button
          disabled={loading}
          onClick={() => setPage((p) => p + 1)}
        >
          &gt;
        </Button>
      </div>
    </div>
  )
}

export default PublicRooms
