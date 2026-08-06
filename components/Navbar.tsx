'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Library', href: '/' },
    { label: 'Add New', href: '/book/new' },

]

const Navbar = () => {

    const pathName = usePathname()

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
                </nav>
            </div>
        </header>
    )
}
export default Navbar
