import  'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id?: string
            username?: string
            email?: string
            isAdmin?: boolean
        } & DefaultSession['user']
    }

    interface User {
        id?: string
        username?: string
        email?: string
        isAdmin?: boolean
    }
}
declare module "next-auth/jwt"{
    interface JWT{
        id?: string
        username?: string
        email?: string
        isAdmin?: boolean
    }
}