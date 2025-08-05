'use client'

import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import Link from 'next/link'
import { MenuIcon, PanelsTopLeft } from 'lucide-react'
import Menu from "@/components/admin/menu"
import { Button } from '@/components/ui/button'

function SheetMenu() {
    return (
        <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
                <Button 
                    className="h-8 bg-white hover:bg-sky-100 text-black transition-colors" 
                    variant="outline" 
                    size="icon"
                >
                    <MenuIcon size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent
                className="sm:w-72 px-3 h-full flex flex-col bg-white text-black"
                side="left"
            >
                <SheetHeader>
                    <Button
                        className="flex justify-center items-center pb-2 pt-1 hover:bg-sky-100 transition-colors text-black"
                        variant="link"
                        asChild
                    >
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2"
                        >
                            <PanelsTopLeft className="w-6 h-6 mr-1 text-black" />
                            <SheetTitle className="font-bold text-lg">
                                Groom Box
                            </SheetTitle>
                        </Link>
                    </Button>
                </SheetHeader>
                <Menu isOpen />
            </SheetContent>
        </Sheet>
    )
}

export default SheetMenu
