'use client'
import React, { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import BookSearchBar from '@/components/BookSearchBar'

const navItems = [
    { label: 'Library', href: '/' },
    { label: 'Add New', href: '/books/new' },
]

const Navbar = () => {

    const pathName = usePathname()
    const { user } = useUser()
    const isLibraryRoute = pathName === '/'

    return (
        <header className="w-full fixed z-50 bg-(--bg-primary) border-b border-[var(--border-subtle)]">
            <div className="wrapper navbar-height py-4 flex items-center gap-4 justify-between">
                <Link href="/" className="flex items-center gap-0.5 shrink-0">
                    <Image src="/assets/logo.png" alt="PagePilot AI" width={48} height={48} />
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-[28px] font-semibold text-[#1C1A17]">
                            Page
                            <span className="italic text-[#7A2E2C]">Pilot</span>
                        </span>

                        <span className="rounded-md border border-black/15 bg-[#F7F2E7] px-[7px] py-[3px] text-[11px] font-semibold tracking-[0.05em] text-[#1C1A17]">
                            AI
                        </span>
                    </div>
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
