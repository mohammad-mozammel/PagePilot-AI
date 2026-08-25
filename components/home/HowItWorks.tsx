import { BookOpen, Headphones, MessagesSquare } from 'lucide-react'
import Reveal from '@/components/Reveal'

const STEPS = [
    {
        number: '01',
        title: 'Upload any PDF',
        text: 'A novel, a textbook, a 400-page manual — drop it in and PagePilot extracts the full text, ready to talk about.',
        icon: BookOpen,
    },
    {
        number: '02',
        title: 'Choose its voice',
        text: 'Pick from five natural AI voices. Whoever narrates, it sounds like a person — not a robot reading a manual.',
        icon: Headphones,
    },
    {
        number: '03',
        title: 'Talk with your book',
        text: 'Ask what a passage meant, request a quick summary, or just say “read me this chapter” and listen.',
        icon: MessagesSquare,
    },
]

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="mt-28 md:mt-36" aria-labelledby="hiw-heading">
            <div className="section-head">
                <p className="studio-label"><span className="studio-label-dot" aria-hidden="true" />How it works</p>
                <h2 id="hiw-heading" className="section-title md:text-4xl md:leading-tight max-w-xl">
                    From PDF to conversation in three steps
                </h2>
            </div>

            <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STEPS.map(({ number, title, text, icon: Icon }) => (
                    <article key={number} className="hiw-card">
                        <div className="hiw-step-head">
                            <span className="hiw-card-num">{number}</span>
                            <span className="hiw-icon" aria-hidden="true">
                                <Icon className="w-5 h-5" />
                            </span>
                        </div>
                        <h3 className="hiw-card-title">{title}</h3>
                        <p className="hiw-card-text">{text}</p>
                    </article>
                ))}
            </Reveal>
        </section>
    )
}

export default HowItWorks
