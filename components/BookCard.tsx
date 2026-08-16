'use client'

import Link from 'next/link'
import { BookCardProps } from '@/types'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const BookCard = ({ title, author, coverURL, slug, coverColor, variant = 'grid' }: BookCardProps) => {
    const fallbackSrc = '/assets/book-cover.svg'
    const isFeatured = variant === 'featured'
    const isShelf = variant === 'shelf'

    return (
        <Link
            href={`/books/${slug}`}
            className="book-card group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A2E2C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2E7] rounded-[14px]"
            aria-label={`Open ${title} by ${author}`}
        >
            <article
                className="relative flex flex-col transition-all duration-200 h-full"
                style={{ backgroundColor: coverColor || '#F7F2E7' }}
            >
                <div className="book-card-3d book-card-3d-hover">
                    <div className="book-card-spine" aria-hidden="true" />

                    <div
                        className={cn(
                            'book-card-cover-wrapper group-hover:shadow-soft-md transition-shadow duration-200',
                            isFeatured && 'book-card-cover-wrapper--featured',
                            isShelf && 'book-card-cover-wrapper--shelf'
                        )}
                    >
                        <Image
                            src={coverURL}
                            alt={`Cover of ${title} by ${author}`}
                            width={133}
                            height={200}
                            className={cn(
                                'book-card-cover',
                                isFeatured && 'book-card-cover--featured',
                                isShelf && 'book-card-cover--shelf'
                            )}
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement
                                if (!target.src.endsWith(fallbackSrc)) {
                                    target.src = fallbackSrc
                                }
                            }}
                        />

                        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" aria-hidden="true" />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                            <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-soft-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                                <BookOpen className="w-5 h-5 text-[#7A2E2C]" />
                            </div>
                        </div>
                    </div>

                    {isShelf && <div className="book-card-shelf-ledge" aria-hidden="true" />}
                </div>

                <div className="book-card-meta">
                    <h3
                        className={cn(
                            'book-card-title group-hover:text-[#7A2E2C] transition-colors duration-200',
                            isShelf && 'book-card-title--shelf'
                        )}
                    >
                        {title}
                    </h3>
                    <p
                        className={cn(
                            'book-card-author group-hover:text-[#7A2E2C]/80 transition-colors duration-200',
                            isShelf && 'book-card-author--shelf'
                        )}
                    >
                        {author}
                    </p>
                </div>
            </article>
        </Link>
    )
}

export default BookCard
