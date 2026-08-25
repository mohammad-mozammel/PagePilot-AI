import React from 'react'
import { auth } from '@clerk/nextjs/server'
import UploadForm from '@/components/UploadForm'
import AddBookSignInGate from '@/components/AddBookSignInGate'

const FLOW = [
    { num: '01', label: 'Source' },
    { num: '02', label: 'Details' },
    { num: '03', label: 'Narrator' },
]

const page = async () => {
    const { userId } = await auth()

    return (
        <main className='new-book'>
            {userId ? (
                <>
                    <div className='newbook-hero'>
                        <p className="studio-label"><span className="studio-label-dot" aria-hidden="true" />New book</p>
                        <h1 className='page-title-xl !text-4xl md:!text-5xl'>Add your next listen</h1>
                        <p className='subtitle !text-base md:!text-lg'>
                            Upload a PDF, tell us who wrote it, and pick the voice that reads it to you.
                        </p>

                        <div className="flow-steps" aria-hidden="true">
                            {FLOW.map(({ num, label }, i) => (
                                <React.Fragment key={num}>
                                    {i > 0 && <span className="flow-line" />}
                                    <span className="flow-chip">
                                        <span className="flow-chip-num">{num}</span>
                                        {label}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <UploadForm />
                </>
            ) : (
                <AddBookSignInGate />
            )}
        </main>
    )
}

export default page
