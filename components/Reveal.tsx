'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RevealProps {
    children: ReactNode
    className?: string
    /** Stagger direct children when they become visible */
    stagger?: boolean
    /** Extra transition delay in ms */
    delay?: number
    as?: 'div' | 'section'
}

const Reveal = ({ children, className, stagger = false, delay = 0, as = 'div' }: RevealProps) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        // Very old browsers: reveal immediately without observer.
        if (typeof IntersectionObserver === 'undefined') {
            node.classList.add('is-visible')
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    const Tag = as

    return (
        <Tag
            ref={ref}
            className={cn('reveal', stagger && 'stagger', isVisible && 'is-visible', className)}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </Tag>
    )
}

export default Reveal
