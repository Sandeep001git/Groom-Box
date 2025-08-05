import React from 'react'
import axios, { AxiosError } from 'axios'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { RoomType } from '@/types/TableTypes'
import { useToast } from './ui/use-toast'
import { io } from 'socket.io-client'
import { CreateRoomSchema } from '@/schema/CreateRoom.schema'
import { useSession } from 'next-auth/react'

function CreateRoom() {
    const route = useRouter()
    const { toast } = useToast()
    const { data: session } = useSession()
    const form = useForm<z.infer<typeof CreateRoomSchema>>({
        resolver: zodResolver(CreateRoomSchema),
        defaultValues: {
            name: '',
            isPrivate: false,
        },
    })
    const onSubmit = async (data: z.infer<typeof CreateRoomSchema>) => {
        const userId = session?.user.id
        const socket = io()
        try {
            const response = await axios.post<RoomType>('/api/create-room', {
                adminId: userId,
                name: data.name,
                isPrivate: data.isPrivate,
            })
            if (response) {
                const roomId = response.data.id
                socket.emit('create-room', roomId, async (data: any) => {
                    if (data.error) {
                        throw new Error(data.error)
                    }
                    console.log(data)
                    const response = await axios.put('/api/update-user-room', {
                        name: data.name,
                        socketId: data.socketId,
                        roomId:roomId,
                    })
                    if (response) {
                        route.replace('/room')
                        toast({
                            title: 'Room Created',
                            description: 'Redirecting to Room',
                        })
                    }
                    // Todo:delete-room Api for room which is created by user first in else part
                })
            }
        } catch (error: typeof AxiosError | any) {
            if (error instanceof AxiosError) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
            } else {
                console.error('An unexpected error occurred', error)
                throw new Error('Error creating the room ')
            }
        }
    }

    return (
        <div className="flex bg-white justify-center p-8 m-2 rounded-lg shadow-md border">
            <div className="flex bg-white justify-center p-8 m-2 rounded-lg shadow-md border">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Create Room</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Fill the following details to create your room.
                                Click submit when you&aposre done.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">
                                                Room Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="text-white"
                                                    placeholder="eg:- Cool Room"
                                                    {...field}
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
                                        <FormItem>
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="terms1"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Make this room private
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Your Room will not be
                                                        listed on public rooms.
                                                    </p>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default CreateRoom
