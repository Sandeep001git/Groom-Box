import { z } from "zod";

export const CreateRoomSchema = z.object({
    name:z.string().min(4,"Room name must at leat of length four"),
    isPrivate:z.boolean()
})