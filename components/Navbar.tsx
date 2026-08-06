'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Library', href: '/' },
    { label: 'Add New', href: '/books/new' },

]

const Navbar = () => {

    const pathName = usePathname()
    const { user } = useUser()

    return (
        <header className="w-full fixed z-50 bg-('--bg-primary')">
            <div className="wrapper navbar-height py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-0.5">
                    <Image src="/assets/logo.png" alt="PagePilot AI" width={42} height={26} />
                    <span className="logo-text">PagePilot AI</span>
                </Link>
                <nav className='w-fit flex gap-7.5 items-center'>
                    {navItems.map(({ label, href }) => {
                        const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));
                        return (
                            <Link href={href} key={label} className={cn('nab-link-base', isActive ? 'nav-link-active' : 'text-black hover:opacity-70')}>
                                {label}
                            </Link>
                        )
                    })}
                    <div className='flex items-center gap-7.5'>
                        <Show when="signed-out">
                            <SignInButton mode='modal' />
                            {/* <SignUpButton /> */}
                        </Show>
                        <Show when="signed-in">
                            <div className='nav-user-link'>
                                <UserButton />
                                {user?.firstName && (
                                    <Link href='/subscriptions'
                                        className='nav-user-name'>
                                        {user?.firstName}
                                    </Link>
                                )}
                            </div>
                        </Show>
                    </div>
                </nav>
            </div>
        </header>
    )
}
export default Navbar
