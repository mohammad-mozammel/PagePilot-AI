const Loading = () => {
    return (
        <main className="wrapper container animate-pulse">
            <div className="hero-section">
                <div className="space-y-4">
                    <div className="h-3 w-32 rounded bg-[var(--border-subtle)]" />
                    <div className="h-9 w-full max-w-sm rounded bg-[var(--border-subtle)]" />
                    <div className="h-4 w-full max-w-xs rounded bg-[var(--border-subtle)]" />
                    <div className="h-11 w-36 rounded-[10px] bg-[var(--border-subtle)] mt-6" />
                </div>
                <div className="flex justify-center">
                    <div className="h-[160px] w-[190px] rounded-md bg-[var(--border-subtle)]" />
                </div>
            </div>

            <div className="library-toolbar mt-2">
                <div className="h-6 w-32 rounded bg-[var(--border-subtle)]" />
            </div>

            <div className="h-3 w-28 rounded bg-[var(--border-subtle)] mb-3 mt-5" />
            <div className="featured-row">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2 shrink-0 w-[128px] sm:w-[150px]">
                        <div className="h-[175px] md:h-[205px] rounded-[14px] bg-[var(--border-subtle)]" />
                        <div className="h-4 w-3/4 rounded bg-[var(--border-subtle)]" />
                        <div className="h-3 w-1/2 rounded bg-[var(--border-subtle)]" />
                    </div>
                ))}
            </div>

            <div className="h-3 w-32 rounded bg-[var(--border-subtle)] mb-3 mt-8" />
            <div className="shelf-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-[120px] md:h-[142px] rounded-[14px] bg-[var(--border-subtle)]" />
                        <div className="h-3 w-3/4 rounded bg-[var(--border-subtle)]" />
                        <div className="h-3 w-1/2 rounded bg-[var(--border-subtle)]" />
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Loading
