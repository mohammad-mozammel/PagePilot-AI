import Link from "next/link";
import { ArrowRight, AudioLines, CheckCircle2 } from "lucide-react";
import HeroSessionMock from "@/components/home/HeroSessionMock";

const steps = [
  { number: "01", title: "Upload a PDF" },
  { number: "02", title: "Pick an AI voice" },
  { number: "03", title: "Ask · Summarize · Listen" },
];

// Deterministic bar config so server and client render identically.
const HERO_BARS = [
  { h: 34, d: "-0.92s", dur: "1.08s" },
  { h: 62, d: "-0.41s", dur: "1.24s" },
  { h: 88, d: "-1.15s", dur: "0.96s" },
  { h: 52, d: "-0.63s", dur: "1.32s" },
  { h: 96, d: "-0.28s", dur: "1.02s" },
  { h: 70, d: "-0.85s", dur: "1.18s" },
  { h: 44, d: "-0.37s", dur: "1.28s" },
  { h: 90, d: "-1.05s", dur: "1.06s" },
  { h: 58, d: "-0.55s", dur: "1.22s" },
  { h: 78, d: "-0.95s", dur: "1.04s" },
];

export default function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      {/* Ambient backdrop — glow + fading dot grid */}
      <div className="hero-bg" aria-hidden="true" />

      {/* Left — announcement, positioning, CTAs, steps */}
      <div>
        <Link href="/subscriptions" className="announce-pill anim-rise" style={{ animationDelay: "0ms" }}>
          <span className="announce-pill-tag">New</span>
          Pro unlocks 60-minute listening sessions
          <ArrowRight className="size-3.5 text-[var(--accent-text)]" aria-hidden="true" />
        </Link>

        <h1
          id="hero-heading"
          className="hero-title anim-rise"
          style={{ animationDelay: "80ms" }}
        >
          Your books,
          <br />
          ready to <em className="italic text-[var(--accent-text)]">talk.</em>
        </h1>

        <p
          className="hero-description anim-rise"
          style={{ animationDelay: "160ms" }}
        >
          Upload any PDF and PagePilot turns it into a real conversation — ask
          questions mid-chapter, request summaries, or sit back and listen while
          an AI voice reads it aloud.
        </p>

        <div
          className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 anim-rise"
          style={{ animationDelay: "240ms" }}
        >
          <Link href="/books/new" className="hero-cta !mt-0">
            Upload your first book
          </Link>
          <a href="#how-it-works" className="!mt-0 hero-cta-secondary !py-[13px]">
            <AudioLines className="w-4 h-4 text-[var(--accent-deep)]" aria-hidden="true" />
            See how it works
          </a>
        </div>

        <p className="hero-trust anim-rise" style={{ animationDelay: "300ms" }}>
          <span>No installs</span>
          <span aria-hidden="true" className="text-[var(--accent-warm)]">·</span>
          <span>Works in your browser</span>
          <span aria-hidden="true" className="text-[var(--accent-warm)]">·</span>
          <span>Free plan available</span>
        </p>

        <div className="hero-steps anim-rise" style={{ animationDelay: "380ms" }}>
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start flex-1 last:flex-none gap-x-3">
              <div className="hero-step">
                <span className="hero-step-number">{step.number}</span>
                <span className="hero-step-title">{step.title}</span>
              </div>
              {i < steps.length - 1 && <div className="hero-step-line" />}
            </div>
          ))}
        </div>
      </div>

      {/* Product preview — tilted live session with floating status cards */}
      <div className="hero-visual glow-panel">
        <div
          className="relative mb-8 flex h-12 w-full max-w-[200px] items-end justify-center gap-2 text-[var(--accent-deep)] anim-rise"
          style={{ animationDelay: "180ms" }}
          aria-hidden="true"
        >
          {HERO_BARS.map((bar, i) => (
            <span
              key={i}
              className="flex-1 max-w-[8px] rounded-full bg-current opacity-80 origin-bottom animate-[eq-bounce_1.15s_ease-in-out_infinite]"
              style={{
                height: `${bar.h}%`,
                animationDelay: bar.d,
                animationDuration: bar.dur,
              }}
            />
          ))}
        </div>

        <div className="hero-mock-wrap anim-rise" style={{ animationDelay: "260ms" }}>
          <div className="mock-tilt">
            <HeroSessionMock />
          </div>

          {/* Floating voice card — outside the tilted element */}
          <div className="float-card float-voice" aria-hidden="true">
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[var(--success)]" />
            </span>
            <span>
              <span className="float-card-title block">Rachel is reading…</span>
              <span className="float-card-sub block">Chapter 3 · Atomic Habits</span>
            </span>
          </div>

          {/* Floating summary card — outside the tilted element */}
          <div className="float-card float-summary" aria-hidden="true">
            <span className="float-card-icon">
              <CheckCircle2 className="size-4.5" />
            </span>
            <span>
              <span className="float-card-title block">Summary ready</span>
              <span className="float-card-sub block">Chapter 3 · one line</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
