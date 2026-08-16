'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

const DEBOUNCE_MS = 350

const BookSearchBar = ({ initialQuery }: { initialQuery?: string }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentQuery = searchParams.get('search') ?? ''
    const [query, setQuery] = useState(initialQuery ?? currentQuery)
    const [prevQuery, setPrevQuery] = useState(currentQuery)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    // Keep the input in sync when the URL changes (back/forward navigation, cleared query)
    if (currentQuery !== prevQuery) {
        setPrevQuery(currentQuery)
        setQuery(currentQuery)
    }

    // Clear pending debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    const updateSearch = (value: string, immediate = false) => {
        const apply = () => {
            const params = new URLSearchParams(searchParams.toString())
            const trimmed = value.trim()

            if (trimmed) {
                params.set('search', trimmed)
            } else {
                params.delete('search')
            }

            const qs = params.toString()
            router.replace(qs ? `/?${qs}` : '/')
        }

        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (immediate) {
            apply()
            return
        }
        debounceRef.current = setTimeout(apply, DEBOUNCE_MS)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateSearch(query, true)
    }

    return (
        <form className="library-search-wrapper" role="search" onSubmit={handleSubmit}>
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" aria-hidden="true" />
            <input
                type="search"
                value={query}
                onChange={(e) => {
                    const value = e.target.value
                    setQuery(value)
                    updateSearch(value)
                }}
                placeholder="Search your library"
                className="library-search-input"
                aria-label="Search books"
            />
        </form>
    )
}

export default BookSearchBar
