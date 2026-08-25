'use client'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import BookSearchBar from '@/components/BookSearchBar'
import LogoMark from '@/components/LogoMark'

const navItems = [
    { label: 'Library', href: '/' },
    { label: 'Add New', href: '/books/new' },
]

const Navbar = () => {

    const pathName = usePathname()
    const { user } = useUser()
    const isLibraryRoute = pathName === '/'

    return (
        <header className="w-full fixed z-50 bg-(--bg-primary)/85 backdrop-blur-md border-b border-[var(--border-subtle)]">
            <div className="wrapper navbar-height py-4 flex items-center gap-4 justify-between">
                <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="PagePilot AI home">
                    <LogoMark />
                    <span className="flex items-baseline gap-1.5">
                        <span className="logo-wordmark">
                            Page<span className="italic text-[var(--accent-warm)]">Pilot</span>
                        </span>
                        <span className="logo-badge">AI</span>
                    </span>
                </Link>

                {isLibraryRoute && (
                    <Suspense fallback={null}>
                        <BookSearchBar />
                    </Suspense>
                )}

                <nav className='w-fit flex gap-4 sm:gap-7.5 items-center shrink-0'>
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
                            <Link href={href} key={label} className={cn('nav-link-base', isActive ? 'nav-link-active' : 'nav-link-default')}>
                                {label}
                            </Link>
                        )
                    })}
                    <div className='flex items-center gap-6'>
                        <Show when="signed-out">
                            <SignInButton mode='modal' />
                        </Show>
                        <Show when="signed-in">
                            <div className='nav-user-link'>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonPopoverActionButton:
                                                '!text-[#221d13]',
                                            userButtonPopoverActionButtonText:
                                                '!text-[#221d13] font-medium',
                                            userButtonPopoverActionButtonIcon:
                                                '!text-[#221d13]',
                                        },
                                    }}
                                />
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
