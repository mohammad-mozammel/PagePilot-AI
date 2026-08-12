const Loading = () => {
    return (
        <main className="wrapper container animate-pulse">
            <div className="library-hero-card">
                <div className="w-full lg:max-w-[400px] space-y-4">
                    <div className="h-8 w-3/4 rounded bg-[var(--border-subtle)]" />
                    <div className="h-4 w-full rounded bg-[var(--border-subtle)]" />
                    <div className="h-4 w-5/6 rounded bg-[var(--border-subtle)]" />
                </div>
            </div>

            <div className="library-toolbar mt-6">
                <div className="h-6 w-40 rounded bg-[var(--border-subtle)]" />
                <div className="h-10 w-full sm:w-80 rounded-lg bg-[var(--border-subtle)]" />
            </div>

            <div className="library-books-grid">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="h-[205px] md:h-[240px] rounded-[14px] bg-[var(--border-subtle)]" />
                        <div className="h-5 w-3/4 rounded bg-[var(--border-subtle)]" />
                        <div className="h-4 w-1/2 rounded bg-[var(--border-subtle)]" />
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Loading
