'use client'

import { signUpSchema } from '@/schema/SignUp.schema'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
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
import { Eye, EyeOff } from 'lucide-react'


export default function SignIn() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { username: '', email: '', password: '' },
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        try {
            setLoading(true)
            setError(null)

            // Call signup API
            const res = await axios.post('/api/auth/sign-up', data)
            if (res.status !== 200) {
                setError(res.data.message || 'Signup failed')
                setLoading(false)
                return
            }

            // Auto login after signup
            const loginRes = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            })

            if (loginRes?.error) {
                setError('Login after signup failed')
            } else {
                router.replace('/dashboard')
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="p-8 m-2 rounded-lg shadow-md border text-white w-96">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">
                    Sign Up
                </h1>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
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
                                            {...field}
                                            placeholder="Enter username"
                                            className="text-black"
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
                                            {...field}
                                            placeholder="you@example.com"
                                            className="text-black"
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
                                                                <div className="relative">
                                                                    <Input
                                                                        type={
                                                                            showPassword
                                                                                ? 'text'
                                                                                : 'password'
                                                                        }
                                                                        className="text-white pr-10"
                                                                        {...field}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setShowPassword(
                                                                                !showPassword
                                                                            )
                                                                        }
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                                                        tabIndex={-1}
                                                                    >
                                                                        {showPassword ? (
                                                                            <EyeOff size={18} />
                                                                        ) : (
                                                                            <Eye size={18} />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
