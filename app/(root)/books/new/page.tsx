import React from 'react'
import UploadForm from '@/components/UploadForm'

const page = () => {
    return (
        <main className='new-book'>
            <section className='flex flex-col gap-0.5 text-center mb-10 md:mb-14'>
                <h1 className='page-title-xl'>Add a New Book</h1>
                <p className='subtitle mx-auto'>Upload a PDF file to generate your interactive interview.</p>
            </section>
            <UploadForm />
        </main>
    )
}

export default page