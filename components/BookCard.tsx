
import Link from 'next/link'
import { BookCardProps } from '@/types'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const BookCard = ({ title, author, coverURL, slug, coverColor }: BookCardProps) => {
    const fallbackSrc = '/assets/book-cover.svg'

    return (
        <Link
            href={`/books/${slug}`}
            className="book-card group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#663820] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f4e9] rounded-[14px]"
            aria-label={`Open ${title} by ${author}`}
        >
            <article
                className="relative flex flex-col transition-all duration-200 h-full"
                style={{ backgroundColor: coverColor || '#f8f4e9' }}
            >
                <div className="book-card-3d book-card-3d-hover">
                    <div className="book-card-spine" aria-hidden="true" />

                    <div className="book-card-cover-wrapper group-hover:shadow-soft-md transition-shadow duration-200">
                        <Image
                            src={coverURL}
                            alt={`Cover of ${title} by ${author}`}
                            width={133}
                            height={200}
                            className="book-card-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                            loading="lazy"
                            // onError={(e) => {
                            //     const target = e.currentTarget as HTMLImageElement
                            //     if (target.src !== fallbackSrc) {
                            //         target.src = fallbackSrc
                            //     }
                            // }}
                        />

                        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" aria-hidden="true" />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                            <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-soft-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                                <BookOpen className="w-5 h-5 text-[#663820]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="book-card-meta">
                    <h3
                        className={cn(
                            'book-card-title group-hover:text-[#663820] transition-colors duration-200'
                        )}
                    >
                        {title}
                    </h3>
                    <p className="book-card-author group-hover:text-[#663820]/80 transition-colors duration-200">
                        {author}
                    </p>
                </div>
            </article>
        </Link>
    )
}

export default BookCard