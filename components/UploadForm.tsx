"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Upload, Image as ImageIcon, X, FileText, GripVertical, Volume2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import LoadingOverlay from '@/components/LoadingOverlay'
import {
  voiceOptions,
  voiceCategories,
  MAX_FILE_SIZE,
  ACCEPTED_PDF_TYPES,
  MAX_IMAGE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from '@/lib/constants'
import { cn, parsePDFFile } from '@/lib/utils'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { checkBookExists, createBook, saveBookSegments } from '@/lib/actions/book.actions'
import { useRouter } from 'next/navigation'
import { upload } from '@vercel/blob/client'

const formSchema = z.object({
  pdfFile: z
    .custom<File | null>()
    .refine((file) => file instanceof File, 'Please upload a PDF file')
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'PDF file size must be less than 50MB'
    )
    .refine(
      (file) => !file || ACCEPTED_PDF_TYPES.includes(file.type),
      'Only PDF files are accepted'
    ),
  coverImage: z
    .custom<File | null>()
    .optional()
    .refine(
      (file) => !file || file instanceof File,
      'Please upload a valid image file'
    )
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      'Cover image size must be less than 10MB'
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPG, PNG, and WebP images are accepted'
    ),
  title: z
    .string()
    .min(1, 'Title must be at least 1 characters')
    .max(100, 'Title must be less than 100 characters'),
  author: z
    .string()
    .min(1, 'Author name must be at least 1 characters')
    .max(100, 'Author name must be less than 100 characters'),
  persona: z.enum(['dave', 'daniel', 'chris', 'rachel', 'sarah'], {
    message: 'Please select a valid voice',
  }),
})

type VoiceKey = 'dave' | 'daniel' | 'chris' | 'rachel' | 'sarah' | ''

interface FormValues {
  pdfFile: File | null | undefined
  coverImage: File | null | undefined
  title: string
  author: string
  persona: VoiceKey
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface DropzoneProps {
  inputRef: React.RefObject<HTMLInputElement | null>
  file: File | null | undefined
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  accept: string
  icon?: React.ReactNode
  uploadedIcon?: React.ReactNode
  emptyText?: string
  emptyHint?: string
  uploadedHint?: string
  className?: string
  render?: (ctx: { file: File | null | undefined; isDragOver: boolean }) => React.ReactNode
}

const Dropzone: React.FC<DropzoneProps> = ({
  inputRef,
  file,
  onFileSelect,
  onFileRemove,
  accept,
  icon,
  uploadedIcon,
  emptyText = '',
  emptyHint = '',
  uploadedHint = 'Click to change file',
  className,
  render,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const openFilePicker = () => inputRef.current?.click()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openFilePicker()
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      const droppedFile = e.dataTransfer.files?.[0]
      if (droppedFile) onFileSelect(droppedFile)
    },
    [onFileSelect]
  )

  const handleRemoveClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if ('key' in e) {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
    }
    onFileRemove()
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileSelect(f)
        }}
        className="hidden"
      />
      <div
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!isDragOver) setIsDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (isDragOver) setIsDragOver(false)
        }}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={file ? `${uploadedHint}: ${file.name}` : emptyText}
        className={cn(
          'outline-none transition-all duration-200',
          className
            ? cn(className, isDragOver && 'border-[var(--accent-warm)]')
            : cn(
              'upload-dropzone border-2 border-dashed',
              file ? 'upload-dropzone-uploaded border-[var(--accent-warm)]/50' : 'border-[var(--border-medium)]',
              isDragOver && 'scale-[1.01] border-[var(--accent-warm)] bg-[var(--bg-elevated)] shadow-soft-md',
              !file && !isDragOver && 'focus-visible:border-[var(--accent-warm)] focus-visible:ring-2 focus-visible:ring-[var(--accent-warm)]/20'
            )
        )}
      >
        {render ? (
          render({ file, isDragOver })
        ) : file ? (
          <div className="flex flex-col items-center gap-2">
            {uploadedIcon}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full px-2">
              <span className="upload-dropzone-text font-semibold truncate max-w-[220px] sm:max-w-xs">
                {file.name}
              </span>
              <span className="text-xs font-medium text-[var(--accent-warm)] bg-[var(--accent-glow)] px-2 py-0.5 rounded-md">
                {formatFileSize(file.size)}
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Remove ${file.name}`}
                onClick={handleRemoveClick}
                onKeyDown={handleRemoveClick}
                className="upload-dropzone-remove shrink-0"
              >
                <X className="w-5 h-5" />
              </span>
            </div>
            <span className="upload-dropzone-hint text-sm flex items-center gap-1">
              <GripVertical className="w-3 h-3 opacity-50" />
              {uploadedHint}
            </span>
          </div>
        ) : (
          <>
            {isDragOver ? (
              <GripVertical className="upload-dropzone-icon animate-bounce text-[var(--accent-warm)]" />
            ) : (
              icon
            )}
            <span className="upload-dropzone-text">
              {isDragOver ? 'Drop to upload' : emptyText}
            </span>
            <span className="upload-dropzone-hint">{emptyHint}</span>
          </>
        )}
      </div>
    </div>
  )
}

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const { userId } = useAuth()
  const router = useRouter()



  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: '',
      author: '',
      persona: '',
      pdfFile: undefined,
      coverImage: undefined,
    },
    mode: 'onTouched',
  })

  const pdfFile = useWatch({ control: form.control, name: 'pdfFile' })
  const coverImage = useWatch({ control: form.control, name: 'coverImage' })
  const watchedTitle = useWatch({ control: form.control, name: 'title' })
  const watchedAuthor = useWatch({ control: form.control, name: 'author' })
  const watchedPersona = useWatch({ control: form.control, name: 'persona' })

  const coverPreviewUrl = useMemo(() => {
    if (coverImage instanceof File) {
      return URL.createObjectURL(coverImage)
    }
    return null
  }, [coverImage])

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl)
    }
  }, [coverPreviewUrl])

  const handlePdfSelect = useCallback(
    (file: File) => {
      form.setValue('pdfFile', file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    [form]
  )

  const handlePdfRemove = useCallback(() => {
    form.setValue('pdfFile', null, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [form])

  const handleCoverSelect = useCallback(
    (file: File) => {
      form.setValue('coverImage', file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    [form]
  )

  const handleCoverRemove = useCallback(() => {
    form.setValue('coverImage', null, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [form])

  const onSubmit = async (data: FormValues) => {
    if (!userId) {
      return toast.error('Please login to upload book')
    }

    setIsSubmitting(true)
    setCurrentStep(1)

    try {
      const existsCheck = await checkBookExists(data.title)

      if (existsCheck.exists && existsCheck.book) {
        toast.info('A book with this title already exists');
        form.reset()
        router.push(`/books/${existsCheck.book.slug}`)
        return;
      }

      const fileTitle = data.title.replace(/\s+/g, '_').toLowerCase();
      const pdfFileData = data.pdfFile;

      if (!pdfFileData) {
        toast.error('Please upload a PDF file');
        return;
      }

      const parsedPDF = await parsePDFFile(pdfFileData);

      if (parsedPDF.content.length === 0) {
        toast.error("Failed to parse PDF. Please try again with a different file.");
        return;
      }

      setCurrentStep(0)

      const uploadedPdfBlob = await upload(fileTitle, pdfFileData, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: 'application/pdf'
      });

      let coverUrl: string;
      let coverBlobKey: string | undefined;

      if (data.coverImage) {
        const coverFile = data.coverImage;

        const uploadedCoverBlob = await upload(`${fileTitle}_cover`, coverFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: coverFile.type
        });

        coverUrl = uploadedCoverBlob.url;
        coverBlobKey = uploadedCoverBlob.pathname;

      } else {
        const response = await fetch(parsedPDF.cover)
        const blob = await response.blob();

        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: 'image/png'
        })

        coverUrl = uploadedCoverBlob.url;
        coverBlobKey = uploadedCoverBlob.pathname;
      }

      setCurrentStep(2)

      const book = await createBook({
        clerkId: userId,
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        coverBlobKey,
        fileSize: pdfFileData.size
      })

      if (!book.success) {
        const message = typeof book.error === 'string' ? book.error : 'Failed to create book'
        if (book.isBillingError) {
          toast.error(message, {
            action: {
              label: 'Upgrade',
              onClick: () => router.push('/subscriptions'),
            },
          })
        } else {
          toast.error(message)
        }
        throw new Error('Failed to create book');
      }

      if (book.alreadyExists && book.data) {
        toast.info('A book with this title already exists');
        form.reset()
        router.push(`/books/${book.data.slug}`)
        return;
      }

      setCurrentStep(3)

      const segments = await saveBookSegments(book.data._id, userId, parsedPDF.content);

      if (!segments.success) {
        toast.error("Failed to save book segments");
        throw new Error("Failed to save book segments");
      }

      form.reset();
      toast.success('Book uploaded successfully!');
      router.push(`/books/${book.data.slug}`)

    } catch (error) {
      console.error('Submission error:', error)

      toast.error('Failed to upload book. Please try again later.')

    } finally {
      setIsSubmitting(false)
    }
  }

  const renderVoiceOption = (voiceKey: VoiceKey) => {
    const voice = voiceOptions[voiceKey as keyof typeof voiceOptions]
    return (
      <FormField
        key={voiceKey}
        control={form.control}
        name="persona"
        render={({ field }) => {
          const isSelected = field.value === voiceKey
          return (
            <label
              className={cn(
                'voice-selector-option flex-col sm:flex-col sm:items-start sm:justify-start text-left cursor-pointer select-none',
                isSelected && 'voice-selector-option-selected ring-1 ring-[var(--accent-warm)]/30',
                !isSelected && 'voice-selector-option-default'
              )}
            >
              <input
                type="radio"
                name={field.name}
                value={voiceKey}
                checked={isSelected}
                onChange={() => field.onChange(voiceKey)}
                onBlur={field.onBlur}
                ref={field.ref}
                className="sr-only"
              />
              <div className="flex items-center w-full sm:w-auto gap-2 mb-1">
                <span
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 shrink-0',
                    isSelected
                      ? 'border-[var(--accent-warm)] bg-[var(--accent-glow)]'
                      : 'border-[var(--border-medium)] bg-transparent'
                  )}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-warm)] animate-in zoom-in-50 duration-150" />
                  )}
                </span>
                <span
                  className={cn(
                    'font-semibold text-base',
                    isSelected ? 'text-[var(--accent-warm)]' : 'text-[var(--text-primary)]'
                  )}
                >
                  {voice.name}
                </span>
              </div>
              <span
                className={cn(
                  'text-xs sm:text-sm pl-6 sm:pl-0 leading-snug',
                  isSelected ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'
                )}
              >
                {voice.description}
              </span>
            </label>
          )
        }}
      />
    )
  }

  return (
    <>
      <LoadingOverlay isLoading={isSubmitting} title="Synthesizing your book..." currentStep={currentStep} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="newbook-layout"
          noValidate
        >
          {/* Live preview — the cover itself doubles as the cover-image dropzone */}
          <aside className="newbook-sidebar">
            <p className="preview-frame-caption ">Live preview</p>
            <FormField
              control={form.control}
              name="coverImage"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Dropzone
                      inputRef={coverInputRef}
                      file={coverImage ?? null}
                      onFileSelect={handleCoverSelect}
                      onFileRemove={handleCoverRemove}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className={cn('newbook-preview-cover', coverPreviewUrl && 'newbook-preview-cover-filled')}
                      render={() =>
                        coverPreviewUrl ? (
                          <>
                            <Image
                              src={coverPreviewUrl}
                              alt="Cover preview"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <span
                              role="button"
                              tabIndex={0}
                              aria-label="Remove cover image"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCoverRemove()
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  handleCoverRemove()
                                }
                              }}
                              className="newbook-preview-remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-7 h-7 text-[var(--accent-warm)]" />
                            <span className="text-xs text-[var(--text-muted)] px-4 leading-snug">
                              {pdfFile ? 'Auto-generated from your PDF — or add your own' : 'Click to add a cover'}
                            </span>
                          </>
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="newbook-preview-title">{watchedTitle || 'Untitled book'}</p>
            {watchedAuthor && <p className="newbook-preview-author">{watchedAuthor}</p>}

            {watchedPersona && voiceOptions[watchedPersona as keyof typeof voiceOptions] && (
              <span className="newbook-preview-voice">
                <Volume2 className="w-3 h-3" />
                {voiceOptions[watchedPersona as keyof typeof voiceOptions].name}
              </span>
            )}
          </aside>

          {/* Form panels */}
          <div className="flex flex-col gap-5">
            <section className="form-panel">
              <header className="form-panel-head">
                <span className="form-panel-num">01</span>
                <div>
                  <h2 className="form-panel-title">Source</h2>
                  <p className="form-panel-sub">PDF up to 50MB — text is extracted automatically</p>
                </div>
              </header>
              <FormField
                control={form.control}
                name="pdfFile"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Dropzone
                        inputRef={pdfInputRef}
                        file={pdfFile}
                        onFileSelect={handlePdfSelect}
                        onFileRemove={handlePdfRemove}
                        accept=".pdf,application/pdf"
                        icon={<Upload className="upload-dropzone-icon" />}
                        uploadedIcon={<FileText className="upload-dropzone-icon" />}
                        emptyText="Click or drag PDF here"
                        emptyHint="PDF file (max 50MB)"
                        uploadedHint="Click to change, or drop a new file"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="form-panel">
              <header className="form-panel-head">
                <span className="form-panel-num">02</span>
                <div>
                  <h2 className="form-panel-title">Details</h2>
                  <p className="form-panel-sub">How the book appears in your library</p>
                </div>
              </header>
              <div className="form-row">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="ex: Rich Dad Poor Dad"
                          className="form-input"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Author Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="ex: Robert Kiyosaki"
                          className="form-input"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="form-panel">
              <header className="form-panel-head">
                <span className="form-panel-num">03</span>
                <div>
                  <h2 className="form-panel-title">Narrator</h2>
                  <p className="form-panel-sub">The voice that reads and answers — you can hear it in session</p>
                </div>
              </header>
              <FormItem>
                <FormControl>
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-secondary)] mb-2.5">Male voices</p>
                      <div className="voice-selector-options">
                        {voiceCategories.male.map((vk) =>
                          renderVoiceOption(vk as VoiceKey)
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-secondary)] mb-2.5">Female voices</p>
                      <div className="voice-selector-options">
                        {voiceCategories.female.map((vk) =>
                          renderVoiceOption(vk as VoiceKey)
                        )}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </section>

            <div>
              <button
                type="submit"
                className="form-btn"
                disabled={isSubmitting || form.formState.isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-[#231a07]/30 border-t-[#231a07] rounded-full animate-spin" />
                    Preparing your book...
                  </span>
                ) : (
                  'Make it talk'
                )}
              </button>
              <p className="submit-note">Takes about a minute · Free plan includes 1 book</p>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export default UploadForm