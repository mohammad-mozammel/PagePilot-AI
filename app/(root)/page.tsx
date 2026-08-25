import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import HowItWorks from "@/components/home/HowItWorks";
import BentoFeatures from "@/components/home/BentoFeatures";
import PricingTeaser from "@/components/home/PricingTeaser";
import Faq from "@/components/home/Faq";
import CtaBand from "@/components/home/CtaBand";
import { getAllBooks } from "@/lib/actions/book.actions";
import { BookOpen, Library } from "lucide-react";
import BookCard from "@/components/BookCard";

export const dynamic = 'force-dynamic'

const Page = async ({ searchParams }: PageProps<"/">) => {
    const { search } = await searchParams;
    const query = typeof search === 'string' ? search.trim() : '';

    const bookResults = await getAllBooks(query)
    const books = bookResults.success ? bookResults.data ?? [] : []
    const showEmptyState = books.length === 0
    const isSearching = query.length > 0

    // getAllBooks already sorts by most recent first, so the first few are
    // naturally the "continue listening" set and the rest fill out the shelf.
    const featuredBooks = isSearching ? [] : books.slice(0, 3)
    const shelfBooks = isSearching ? [] : books.slice(3)

    return (
        <>
            <main id="main-content" className="wrapper container">
                {!isSearching && <HeroSection />}
               
                {/* Library — sits right under the hero so books are seen first */}
                <section className={!isSearching ? 'mt-14 md:mt-20' : ''} aria-label="Your library">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
                        <div className="flex flex-col gap-3">
                            {!isSearching && (
                                <p className="studio-label"><span className="studio-label-dot" aria-hidden="true" />Your library</p>
                            )}
                            <h2 className="library-toolbar-title">
                                {isSearching ? `Results for “${query}”` : 'Pick up where you left off'}
                            </h2>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 pb-1">
                            {books.length > 0 && (
                                <span className="lib-count">
                                    {books.length} {books.length === 1 ? 'book' : 'books'}
                                </span>
                            )}
                            {!isSearching && (
                                <Link href="/books/new" className="btn-secondary !py-2 !px-4 text-sm">
                                    <BookOpen className="size-4" aria-hidden="true" />
                                    Add a book
                                </Link>
                            )}
                        </div>
                    </div>

                    {showEmptyState ? (
                        <Reveal className="library-empty-card">
                            <div className="library-empty-icon">
                                <Library className="w-7 h-7" />
                            </div>
                            <p className="library-empty-title">
                                {isSearching ? "No books found" : "Your library is empty"}
                            </p>
                            <p className="library-empty-hint">
                                {isSearching
                                    ? `No books match "${query}". Try a different search or clear the filter.`
                                    : "Upload a PDF and start talking with it — questions, summaries, read-aloud."}
                            </p>
                            <Link href="/books/new" className="btn-primary mt-2">
                                <BookOpen className="w-4 h-4" />
                                Add your first book
                            </Link>
                        </Reveal>
                    ) : (
                        <>
                            {featuredBooks.length > 0 && (
                                <>
                                    <p className="library-subheading">Continue listening</p>
                                    <Reveal stagger className="featured-row">
                                        {featuredBooks.map((book) => (
                                            <BookCard key={book._id} variant="featured" title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} coverColor={book.coverColor} persona={book.persona} />
                                        ))}
                                    </Reveal>
                                </>
                            )}

                            {(shelfBooks.length > 0 || isSearching) && (
                                <>
                                    {!isSearching && shelfBooks.length > 0 && (
                                        <p className="library-subheading">On the shelf</p>
                                    )}
                                    <Reveal stagger className={isSearching ? 'library-books-grid' : 'shelf-grid'}>
                                        {(isSearching ? books : shelfBooks).map((book) => (
                                            <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} coverColor={book.coverColor} />
                                        ))}
                                    </Reveal>
                                </>
                            )}
                        </>
                    )}
                </section>

                {/* Story sections */}
                {!isSearching && (
                    <>

                        <HowItWorks />
                        <BentoFeatures />

                        {/* Manifesto */}
                        <Reveal className="manifesto-band">
                            <p className="studio-label justify-center"><span className="studio-label-dot" aria-hidden="true" />Why we built this</p>
                            <blockquote className="manifesto-quote">
                                “Every book deserves a{' '}
                                <em className="italic text-[var(--accent-text)]">voice</em> — and every
                                reader deserves more time.”
                            </blockquote>
                        </Reveal>

                        <PricingTeaser />
                        <Faq />
                        <CtaBand />
                    </>
                )}
            </main>

            <Footer />
        </>
    );
}

export default Page
