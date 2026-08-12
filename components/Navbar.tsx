'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Library', href: '/' },
    { label: 'Add New', href: '/books/new' },
]

const Navbar = () => {

    const pathName = usePathname()
    const { user } = useUser()

    return (
        <header className="w-full fixed z-50 bg-(--bg-primary) border-b border-[var(--border-subtle)]">
            <div className="wrapper navbar-height py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-0.5">
                    <Image src="/assets/logo.png" alt="PagePilot AI" width={42} height={26} />
                    <span className="logo-text">PagePilot AI</span>
                </Link>
                <nav className='w-fit flex gap-4 sm:gap-7.5 items-center'>
                    {navItems.map(({ label, href }) => {
                        const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));
                        const isCta = href === '/books/new';
                        if (isCta) {
                            return (
                                <Link href={href} key={label} className="btn-nav-cta">
                                    <Plus className="w-4 h-4" />
                                    {label}
                                </Link>
                            )
                        }
                        return (
                            <Link href={href} key={label} className={cn('nab-link-base', isActive ? 'nav-link-active' : 'nav-link-default')}>
                                {label}
                            </Link>
                        )
                    })}
                    <div className='flex items-center gap-7.5'>
                        <Show when="signed-out">
                            <SignInButton mode='modal' />
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
