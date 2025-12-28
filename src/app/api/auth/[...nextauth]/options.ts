import initializeUserModel from '@/models/User.model'
import { ApiError } from '@/utils/ApiError'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'

export const authOptions:NextAuthOptions = {
    providers: [
        Github({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        Credentials({
            type: 'credentials',
            credentials: {
                email: { type: 'email', label: 'Email' },
                password: { type: 'password', label: 'Password' },
            },
            async authorize(credentials, _req) {
                const User = await initializeUserModel()
                try {
                    if (!User) {
                        throw new ApiError({
                            success: false,
                            message: 'Database Error',
                            description: 'User model could not be initialized.',
                        })
                    }

                    const user = await User.findOne({
                        where: { email: credentials?.email },
                    })

                    if (!user) {
                        throw new ApiError({
                            success: false,
                            message: 'Authentication Error',
                            description: 'No user found with this email.',
                        })
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials?.password!,
                        user.password!
                    )
                    if (!isPasswordValid) {
                        throw new ApiError({
                            success: false,
                            message: 'Authentication Error',
                            description: 'Invalid password.',
                        })
                    }

                    const authUser = {
                        id: user.id?.toString(),
                        email: user.email.toString(),
                        isAdmin: user.isAdmin,
                        username: user.username?.toString(),
                        // Include other necessary fields
                    }

                    return authUser
                } catch (error) {
                    console.error('Error in authorize:', error)
                    throw new ApiError({
                        success: false,
                        message: 'Authentication Error',
                        description: 'Authentication process failed.',
                    })
                }
            },
        }),
    ],
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username
                token.email = user.email
                token.id = user.id
                token.isAdmin = user.isAdmin
            }
            return token
        },
        async session({ session, token }) {
            session.user.email= token.email
            session.user.id = token.id
            session.user.username = token.username
            session.user.isAdmin = token.isAdmin
            return session
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
}
