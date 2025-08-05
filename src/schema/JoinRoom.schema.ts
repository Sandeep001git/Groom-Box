import { z } from "zod";

export const joinRoomSchema =z.object({
    roomId:z.union([z.string(), z.number()])
})