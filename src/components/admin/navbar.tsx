import { UserNav } from '@/components/admin/user-nav'
import SheetMenu from '@/components/admin/sheet-menu'

interface NavbarProps {
    title: string
}

export function Navbar({ title }: NavbarProps) {
    return (
        <header className="sticky top-0 z-10 w-full bg-white shadow backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-white dark:shadow-secondary">
            <div className="mx-4 sm:mx-8 flex h-14 items-center">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <SheetMenu />
                    <h1 className="font-bold text-black dark:text-black">{title}</h1>
                </div>
                <div className="flex flex-1 items-center space-x-2 justify-end">
                    <UserNav />
                </div>
            </div>
        </header>
    )
}
