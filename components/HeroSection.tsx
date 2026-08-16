import Image from "next/image";
import Link from "next/link";

const steps = [
  { number: "01", title: "Upload PDF" },
  { number: "02", title: "AI processes it" },
  { number: "03", title: "Talk it through" },
];

// Muted brand tones used to fill any stack slots that don't have a real cover yet.
const FALLBACK_TONES = ["#5F7A57", "#B08D4F", "#A85850"];

type StackBook = {
  coverURL?: string;
  title?: string;
  coverColor?: string;
};

const STACK_LAYOUT = [
  { left: "0%", top: "16%", rotate: "-9deg", z: 1 },
  { left: "34%", top: "0%", rotate: "4deg", z: 2 },
  { left: "68%", top: "10%", rotate: "-3deg", z: 1 },
];

export default function HeroSection({ books = [] }: { books?: StackBook[] }) {
  const slots = STACK_LAYOUT.map((layout, i) => ({ layout, book: books[i] }));

  return (
    <section className="hero-section">
      {/* Left — eyebrow, headline, description, CTA, steps */}
      <div>
        <p className="hero-eyebrow">Voice-powered reading</p>
        <h1 className="hero-title">
          Read with your ears,
          <br />
          not just your eyes.
        </h1>
        <p className="hero-description">
          Upload any PDF and have a real conversation about it — ask questions,
          request summaries, hear it read aloud.
        </p>
        <Link href="/books/new" className="hero-cta">
          Start reading
        </Link>

        <div className="hero-steps">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              <div className="hero-step">
                <span className="hero-step-number">{step.number}</span>
                <span className="hero-step-title">{step.title}</span>
              </div>
              {i < steps.length - 1 && <div className="hero-step-line" />}
            </div>
          ))}
        </div>
      </div>

      {/* Right — a fanned stack of real (or fallback) book covers on a shelf line */}
      <div className="hero-visual">
        <div className="hero-stack">
          {slots.map(({ layout, book }, i) => (
            <div
              key={i}
              className="hero-stack-item"
              style={{
                left: layout.left,
                top: layout.top,
                transform: `rotate(${layout.rotate})`,
                zIndex: layout.z,
                width: "34%",
                aspectRatio: "2 / 3",
                backgroundColor: book?.coverColor || FALLBACK_TONES[i % FALLBACK_TONES.length],
              }}
            >
              {book?.coverURL && (
                <Image
                  src={book.coverURL}
                  alt={book.title ? `Cover of ${book.title}` : ""}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>
        <div className="hero-shelf-line" />
      </div>
    </section>
  );
}
