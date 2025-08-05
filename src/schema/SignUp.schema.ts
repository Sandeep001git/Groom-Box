import { z } from 'zod'

export const userSignUpValidation = z
    .string()
    .min(3, 'Username must be at leat three carector')
    .max(20, 'Username at most be twenty corrector ')
    .regex(/^[a-zA-Z0-9]/, 'Username must not contain special charctors')

export const signUpSchema = z.object({
    username:userSignUpValidation,
    email:z.string().email({message:'Invalid email address'}),
    password:z.string().min(6,{message:'password must be atleat 6 charector'})
})
