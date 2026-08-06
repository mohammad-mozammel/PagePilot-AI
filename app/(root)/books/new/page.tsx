import React from 'react'
import UploadForm from '@/components/UploadForm'

const page = () => {
    return (
        <main className='wrapper container'>
            <div className='mx-auto max-w-180 space-y-10'>
                <section className='flex flex-col gap-0.5 text-center'>
                    <h1 className='page-title-xl'>Add a New Book</h1>
                    <p className='subtitle'>Upload a PDF file to generate your interactive interview.</p>
                </section>
                <UploadForm />
            </div>
        </main>
    )
}

export default page