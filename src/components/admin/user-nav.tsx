'use client'

import Link from 'next/link'
import { LayoutGrid, LogOut, User } from 'lucide-react'
import { useSession , signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from '@/components/ui/tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserNav() {
    const { data: session } = useSession()
    const user = session?.user

    const onLogout = ()=>{
        signOut({ callbackUrl: '/' })
        console.log('User logged out')
    }
    return (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="relative h-8 w-8 rounded-full bg-white hover:bg-sky-100 transition-colors text-black"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="#" alt="Avatar" />
                                    <AvatarFallback className="bg-transparent text-black">
                                        { user?.username?.charAt(0).toUpperCase() || 'U' }
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Profile</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent className="w-56 bg-white text-black" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.username || 'Name'}</p>
                        <p className="text-xs leading-none text-gray-500">
                            {user?.email || ''}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className="hover:bg-sky-100 cursor-pointer transition-colors"
                        asChild
                    >
                        <Link href="/dashboard" className="flex items-center">
                            <LayoutGrid className="w-4 h-4 mr-3 text-gray-600" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="hover:bg-sky-100 cursor-pointer transition-colors"
                        asChild
                    >
                        <Link href="/account" className="flex items-center">
                            <User className="w-4 h-4 mr-3 text-gray-600" />
                            Account
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="hover:bg-sky-100 cursor-pointer transition-colors"
                    onClick={onLogout}
                >
                    <LogOut className="w-4 h-4 mr-3 text-gray-600" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
