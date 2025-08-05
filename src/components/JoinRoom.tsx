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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { joinRoomSchema } from '@/schema/JoinRoom.schema'
import { RoomType } from '@/types/TableTypes'
import { useToast } from './ui/use-toast'
import { io } from 'socket.io-client'

export function JoinRoom() {
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof joinRoomSchema>>({
        resolver: zodResolver(joinRoomSchema),
        defaultValues: {
            roomId: '',
        },
    })
    const onSubmit = async (data: z.infer<typeof joinRoomSchema>):Promise<void>=> {
        const { roomId } = data
        const socket = io()
        try {
            socket.emit('join-room', roomId, async (response: any) => {
                if (response.error) {
                    throw new Error(response.error)
                }
                const res = await axios.get<RoomType>(
                    `/api/join-room/${roomId}/${socket.id}`
                )
                if (res) {
                    toast({
                        title: `${response.data.name} is Joined`,
                        description: `Redirecting to ${response.data.name} Room `,
                    })
                    router.replace(`/room/${roomId}`)
                }
            })
        } catch (error: typeof AxiosError | any) {
            if (error instanceof AxiosError) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive', // Note: Correct spelling is "variant" not "varient"
                })
            } else {
                console.error('An unexpected error occurred', error)
                throw new Error('Error creating the room ')
            }
        }
    }
    return (
        <div className="flex bg-white justify-center p-8 m-2 rounded-lg shadow-md border">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Join Room</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        {/* <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                        </DialogDescription> */}
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="roomId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">
                                            Room Id
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-white"
                                                placeholder="eg:- 5256-6332-8522..."
                                                {...field}
                                            />
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
    )
}
