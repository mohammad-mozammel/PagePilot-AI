import { IBookSegment } from "@/types";
import { Schema, models, model } from "mongoose";


const BookSegmentSchema = new Schema<IBookSegment>({
    clerkId: { type: String, required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    content: { type: String, required: true },
    segmentIndex: { type: Number, required: true },
    pageNumber: { type: Number },
    wordCount: { type: Number, required: true, default: 0 },
}, { timestamps: true })

BookSegmentSchema.index({ bookId: 1, segmentIndex: 1 }, { unique: true })


const BookSegment = models.BookSegment || model<IBookSegment>('BookSegment', BookSegmentSchema)

export default BookSegment