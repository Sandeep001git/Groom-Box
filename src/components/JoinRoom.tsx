'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { joinRoomSchema } from '@/schema/JoinRoom.schema'
import { z } from 'zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { io } from 'socket.io-client'
import axios, { AxiosError } from 'axios'
import { useState, useRef } from 'react'
import { RoomType } from '@/types/TableTypes'

type FormValues = z.infer<typeof joinRoomSchema>

export default function JoinRoom() {
  const router = useRouter()
  const { toast } = useToast()
  const [joining, setJoining] = useState(false)
  const socketRef = useRef<any>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: { roomId: '' },
  })

  const onSubmit = async (data: FormValues) => {
    if (joining) return
    setJoining(true)

    if (!socketRef.current) {
      socketRef.current = io()
    }

    const socket = socketRef.current

    try {
      socket.emit('join-room', data.roomId, async (response: any) => {
        if (response.error) throw new Error(response.error)

        const res = await axios.get<RoomType>(`/api/join-room/${data.roomId}/${socket.id}`)

        toast({
          title: `Joined ${res.data.name}`,
          description: 'Redirecting to room…',
        })

        router.replace(`/room/${data.roomId}`)
        setJoining(false)
      })
    } catch (err: any) {
      setJoining(false)
      if (axios.isAxiosError(err)) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' })
      } else {
        toast({ title: 'Error', description: err.message || 'Failed to join room', variant: 'destructive' })
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-[1.03] transition-transform">
          Join Room
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl bg-slate-900 text-white border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join a Room</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Room ID" className="bg-slate-800 border-slate-700 text-white" disabled={joining} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={joining}>
                {joining ? 'Joining…' : 'Join'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
