import { Suspense } from "react";
import Link from "next/link";
import BookSearchBar from "@/components/BookSearchBar";
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

    return (
        <main className="wrapper container">
            <HeroSection />
            <div className="library-toolbar">
                <h2 className="library-toolbar-title">{query ? `Results for "${query}"` : "Recent books"}</h2>
                <Suspense fallback={null}>
                    <BookSearchBar initialQuery={query} />
                </Suspense>
            </div>

            {showEmptyState ? (
                <div className="library-empty-card">
                    <div className="library-empty-icon">
                        <Library className="w-8 h-8" />
                    </div>
                    <p className="library-empty-title">
                        {query ? "No books found" : "Your library is empty"}
                    </p>
                    <p className="library-empty-hint">
                        {query
                            ? `No books match "${query}". Try a different search or clear the filter.`
                            : "Upload your first PDF and turn it into an interactive voice conversation."}
                    </p>
                    <Link href="/books/new" className="btn-primary">
                        <BookOpen className="w-4 h-4" />
                        Add a book
                    </Link>
                </div>
            ) : (
                <div className="library-books-grid">
                    {books.map((book) => (
                        <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} coverColor={book.coverColor} />
                    ))}
                </div>
            )}
        </main>
    );
}

export default Page
