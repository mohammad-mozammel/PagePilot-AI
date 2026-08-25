import Link from 'next/link'
import { Plus } from 'lucide-react'
import Reveal from '@/components/Reveal'

const FAQS = [
    {
        q: 'What can I upload?',
        a: 'Any PDF up to 50 MB — novels, textbooks, research papers, manuals, essays. PagePilot extracts the full text and prepares it for conversation.',
    },
    {
        q: 'Can it read my book aloud?',
        a: 'Yes. Start a session and say “read this chapter” — your AI voice reads it aloud, and it pauses naturally whenever you ask a question.',
    },
    {
        q: 'Do my sessions stay after I close the tab?',
        a: 'On the Free plan, sessions end when you close them. Standard and Pro keep your session history, so you can pick up right where you left off.',
    },
    {
        q: 'Which voices are available?',
        a: 'Five studio-grade voices — Dave, Daniel, Chris, Rachel and Sarah. Pick one per book; you can change it any time from the upload flow.',
    },
    {
        q: 'Can I change plans later?',
        a: 'Anytime. Upgrade or downgrade from the membership page — changes apply immediately.',
    },
]

const Faq = () => {
    return (
        <section className="mt-28 md:mt-36" aria-labelledby="faq-heading">
            <div className="faq-layout">
                <div className="faq-side">
                    <div className="flex flex-col items-start gap-4">
                        <p className="studio-label"><span className="studio-label-dot" aria-hidden="true" />FAQ</p>
                        <h2 id="faq-heading" className="section-title md:text-4xl md:leading-tight max-w-sm">
                            Good questions, short answers
                        </h2>
                        <p className="subtitle !text-base !max-w-sm">
                            Everything worth knowing before your first listening session.
                        </p>
                    </div>

                    <div className="faq-contact">
                        <p className="font-serif font-semibold text-[var(--text-primary)]">
                            Still curious?
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            The fastest way to get it is to try it — your first book is free.
                        </p>
                        <Link href="/books/new" className="btn-primary !py-2.5 !px-5 text-sm w-fit">
                            Upload a book free
                        </Link>
                    </div>
                </div>

                <Reveal stagger className="flex flex-col">
                    {FAQS.map(({ q, a }) => (
                        <details key={q} className="faq-item">
                            <summary>
                                {q}
                                <span className="faq-chevron" aria-hidden="true">
                                    <Plus className="size-3.5" />
                                </span>
                            </summary>
                            <p className="faq-answer">{a}</p>
                        </details>
                    ))}
                </Reveal>
            </div>
        </section>
    )
}

export default Faq
