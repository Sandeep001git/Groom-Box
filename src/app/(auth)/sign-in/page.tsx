'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { signInSchema } from '@/schema/SignIn.schema'
import { FaGithub } from 'react-icons/fa'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const res = await signIn('credentials', { redirect: false, ...data })
        console.log(res)
        if (res?.error) {
            setError('Invalid credentials')
        } else {
            router.replace('/dashboard')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white">
            <div className="p-8 m-2 rounded-lg shadow-md border w-96">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                            placeholder="you@example.com"
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

                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>

                <hr className="my-6 border-gray-700" />

                <Button
                    onClick={() => signIn('github')}
                    className="w-full flex items-center justify-center gap-2"
                >
                    <FaGithub /> Continue with GitHub
                </Button>

                <p className="text-center text-sm mt-6">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/sign-up"
                        className="text-blue-400 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
