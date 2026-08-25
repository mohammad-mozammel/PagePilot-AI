const CONTENT_TYPES = [
    'Novels',
    'Textbooks',
    'Research papers',
    'Biographies',
    'Manuals',
    'Essays',
    'Short stories',
    'Study guides',
    'Reports',
    'Handbooks',
]

const Marquee = () => {
    return (
        <section className="marquee" aria-label="Types of documents you can listen to">
            <div className="marquee-track">
                {[0, 1].map((copy) => (
                    <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                        <span className="marquee-item !text-[var(--accent-text)]">
                            Works with any PDF
                            <span className="marquee-dot" />
                        </span>
                        {CONTENT_TYPES.map((label) => (
                            <span key={`${copy}-${label}`} className="marquee-item">
                                {label}
                                <span className="marquee-dot" />
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Marquee
