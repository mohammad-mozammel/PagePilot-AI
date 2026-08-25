import Link from "next/link";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";
import BookSignInGate from "@/components/BookSignInGate";

const Page = async ({ params }: PageProps<"/books/[slug]">) => {
    const { slug } = await params;
    const result = await getBookBySlug(slug);

    if (!result.success || !result.data) redirect("/");

    const book = result.data;
    const { userId } = await auth();

    return (
        <main className="book-page-container">
            <div className="mx-auto w-full max-w-5xl">
                <nav className="reader-breadcrumb" aria-label="Breadcrumb">
                    <Link href="/" className="reader-breadcrumb-link">
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Library
                    </Link>
                    <ChevronRight className="reader-crumb-sep size-3.5" aria-hidden="true" />
                    <span className="truncate">{book.title}</span>
                </nav>

                {userId ? (
                    <VapiControls book={book} />
                ) : (
                    <BookSignInGate
                        title={book.title}
                        author={book.author}
                        coverURL={book.coverURL}
                        redirectUrl={`/books/${slug}`}
                    />
                )}
            </div>
        </main>
    );
};

export default Page;
