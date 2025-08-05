'use client'

import Link from 'next/link'
import { LayoutGrid, LogOut, User } from 'lucide-react'

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
                                        JD
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
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-gray-500">
                            johndoe@example.com
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
                    onClick={() => {}}
                >
                    <LogOut className="w-4 h-4 mr-3 text-gray-600" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
