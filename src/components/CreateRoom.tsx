'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { CreateRoomSchema } from '@/schema/CreateRoom.schema'

type FormValues = z.infer<typeof CreateRoomSchema>

export default function CreateRoom() {
    const router = useRouter()
    const { data: session } = useSession()
    const { toast } = useToast()

    const socketRef = useRef<Socket | null>(null)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        socketRef.current = io()
        return () => {
            socketRef.current?.disconnect()
            socketRef.current = null
        }
    }, [])

    const form = useForm<FormValues>({
        resolver: zodResolver(CreateRoomSchema),
        defaultValues: {
            name: '',
            isPrivate: false,
        },
    })

    const onSubmit = async (data: FormValues) => {
        if (!session?.user?.id || !socketRef.current) return

        try {
            setCreating(true)

            const payload = { ...data, adminId: session.user.id }

            const res = await axios.post('/api/create-room', payload)
            const roomId = res.data.id

            socketRef.current.emit(
                'createRoom',
                roomId,
                async ({ socketId, error }: any) => {
                    if (error) throw new Error(error)

                    await axios.put('/api/update-user-room', {
                        roomId,
                        socketId,
                    })

                    toast({
                        title: 'Room created',
                        description: 'Redirecting you…',
                    })

                    router.replace(`/room/${roomId}`)
                }
            )
        } catch (err: any) {
            toast({
                title: 'Failed to create room',
                description:
                    err?.response?.data?.message || 'Something went wrong.',
                variant: 'destructive',
            })
            setCreating(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    className="
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            text-white font-semibold shadow-lg
            hover:scale-[1.03] transition-transform
          "
                >
                    Create Room
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl bg-slate-900 text-white border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Create a Room
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Team Sync"
                                            disabled={creating}
                                            className="bg-slate-800 border-slate-700"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPrivate"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border border-slate-700 p-4">
                                    <div>
                                        <FormLabel>Private room</FormLabel>
                                        <p className="text-xs text-slate-400">
                                            Only approved users can join
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={creating}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={creating}
                                className="bg-indigo-600 hover:bg-indigo-500"
                            >
                                {creating ? 'Creating…' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
