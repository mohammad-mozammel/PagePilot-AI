import Link from "next/link";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";

const Page = async ({ params }: PageProps<"/books/[slug]">) => {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const { slug } = await params;
    const result = await getBookBySlug(slug);

    if (!result.success || !result.data) redirect("/");

    const book = result.data;

    return (
        <main className="book-page-container">
            <div className="mx-auto w-full max-w-4xl space-y-6">
               

               <VapiControls book ={book}/>
            </div>

            <Link href="/" className="back-btn-floating" aria-label="Back to library">
                <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
            </Link>
        </main>
    );
};

export default Page;