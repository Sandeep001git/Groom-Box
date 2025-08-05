/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { signUpSchema } from '@/schema/SignUp.schema'
import { getProviders, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { FaGithub } from 'react-icons/fa' // Import GitHub icon from react-icons
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface Provider {
    id: string
    name: string
    type: string
    signinUrl: string
    callbackUrl: string
}
export default function SignIn() {
    const route = useRouter()
    const [providers, setProviders] = useState<Provider[]>([])

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders()
            const filteredProviders = Object.values(res ?? {}).filter(
                (provider) => provider.name !== 'Credentials'
            ) as Provider[]
            setProviders(filteredProviders)
        } 
        console.log(providers)
        fetchProviders()
    }, [])

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    if (!providers) return null

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
            const response = await signIn('credentials',{
                redirect:false,
                email:data.email,
                password:data.password
            })
            if(response?.error){
                console.error('error')
            }
            if(response?.url){
                route.replace('/dashboard')
            }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="p-8 m-2 rounded-lg shadow-md border">
                <h1 className="text-3xl text-white font-bold mt-4 mb-8">
                    Sign in to your account
                </h1>

                {/* <form
                method="post"
                action="/api/auth/callback/credentials"
                className="w-80 mt-6"
            >
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        name="username"
                        type="text"
                        {...form.register('username')}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        name="password"
                        type="password"
                        {...form.register('password')}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-500"
                >
                    Sign in
                </button>
            </form> */}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-white"
                                            placeholder="username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-white"
                                            placeholder="abc@123.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            className="text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className=" w-auto">
                            Submit
                        </Button>
                    </form>
                </Form>
                {Object.values(providers).map((provider) => (
                    <div key={provider.name} className="mt-5">
                        <button
                            onClick={() => signIn(provider.id)}
                            className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700"
                        >
                            {provider.name === 'GitHub' && (
                                <FaGithub className="mr-2" />
                            )}
                            Sign in with {provider.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
