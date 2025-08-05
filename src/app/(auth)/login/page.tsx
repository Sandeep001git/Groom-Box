'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { signUpSchema } from '@/schema/SignUp.schema'
import { FaGithub } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const res = await signIn('credentials', { redirect: false, ...data })
    if (res?.error) {
      setError('Invalid credentials')
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="p-8 m-2 rounded-lg shadow-md border w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Form>

        <hr className="my-6" />

        <Button onClick={() => signIn('github')} className="w-full flex items-center justify-center gap-2">
          <FaGithub /> Continue with GitHub
        </Button>
      </div>
    </div>
  )
}
