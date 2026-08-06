import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Upload PDF",
    description: "Add your book file",
  },
  {
    number: 2,
    title: "AI Processing",
    description: "We analyze the content",
  },
  {
    number: 3,
    title: "Voice Chat",
    description: "Discuss with AI",
  },
];

export default function HeroSection() {
  return (
    <section className="container mx-auto">
      <div className="library-hero-card">
        <div className="library-hero-content">
          {/* Left — heading, description, CTA */}
          <div className="library-hero-text">
            <h1 className="library-hero-title">Your Library</h1>
            <p className="library-hero-description">
              Convert your books into interactive AI conversations. Listen, learn, and discuss your
              favorite reads.
            </p>
            <Link href="/books/new" className="library-cta-primary">
              + Add new book
            </Link>
          </div>

          {/* Center — vintage books illustration (mobile) */}
          <div className="library-hero-illustration">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books, globe, and reading lamp"
              width={420}
              height={220}
              className="h-auto w-full `max-w-[340px]` object-contain"
              priority
            />
          </div>

          {/* Center — vintage books illustration (desktop) */}
          <div className="library-hero-illustration-desktop">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books, globe, and reading lamp"
              width={420}
              height={220}
              className="h-auto w-full `max-w-[400px]` object-contain"
              priority
            />
          </div>

          {/* Right — 3-step card */}
          <div className="library-steps-card">
            {steps.map((step) => (
              <div key={step.number} className="library-step-item">
                <span className="library-step-number">{step.number}</span>
                <div>
                  <p className="library-step-title">{step.title}</p>
                  <p className="library-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
