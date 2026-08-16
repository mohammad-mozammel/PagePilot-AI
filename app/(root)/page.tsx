import Link from "next/link";
import HeroSection from "@/components/HeroSection";
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
    // naturally the "continue reading" set and the rest fill out the shelf.
    const featuredBooks = isSearching ? [] : books.slice(0, 3)
    const shelfBooks = isSearching ? [] : books.slice(3)

    return (
        <main className="wrapper container">
            {!isSearching && (
                <HeroSection
                    books={featuredBooks.map((b) => ({ coverURL: b.coverURL, title: b.title, coverColor: b.coverColor }))}
                />
            )}

            <div className="library-toolbar">
                <h2 className="library-toolbar-title">{isSearching ? `Results for "${query}"` : "Your library"}</h2>
            </div>

            {showEmptyState ? (
                <div className="library-empty-card">
                    <div className="library-empty-icon">
                        <Library className="w-8 h-8" />
                    </div>
                    <p className="library-empty-title">
                        {isSearching ? "No books found" : "Your library is empty"}
                    </p>
                    <p className="library-empty-hint">
                        {isSearching
                            ? `No books match "${query}". Try a different search or clear the filter.`
                            : "Upload your first PDF and turn it into an interactive voice conversation."}
                    </p>
                    <Link href="/books/new" className="btn-primary">
                        <BookOpen className="w-4 h-4" />
                        Add a book
                    </Link>
                </div>
            ) : isSearching ? (
                <div className="library-books-grid">
                    {books.map((book) => (
                        <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} coverColor={book.coverColor} />
                    ))}
                </div>
            ) : (
                <>
                    {featuredBooks.length > 0 && (
                        <>
                            <p className="library-subheading">Continue reading</p>
                            <div className="featured-row">
                                {featuredBooks.map((book) => (
                                    <BookCard key={book._id} variant="featured" title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} coverColor={book.coverColor} />
                                ))}
                            </div>
                        </>
                    )}

                    {shelfBooks.length > 0 && (
                        <>
                            <p className="library-subheading">Rest of your shelf</p>
                            <div className="shelf-grid">
                                {shelfBooks.map((book) => (
                                    <BookCard key={book._id} variant="shelf" title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} coverColor={book.coverColor} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </main>
    );
}

export default Page
