import mongoose, { Types } from 'mongoose'

export interface Offer {
  _id: Types.ObjectId
  className: string
  studentName: string
  tithing: number
  offer: number
  teacher: Types.ObjectId
  student: Types.ObjectId
  subject: Types.ObjectId
  createdAt: Date
}

const offerSchema = new mongoose.Schema({
  className: { type: String, default: null, },
  studentName: { type: String, default: null, },
  tithing: { type: Number, default: 0 },
  offer: { type: Number, default: 0 },
  teacher: { type: 'ObjectId', ref: 'User', default: null },
  student: { type: 'ObjectId', ref: 'Student', default: null },
  subject: { type: 'ObjectId', ref: 'Subject', default: null },
  createdAt: { type: Date, default: Date.now },
})

export const OfferModel = mongoose.model<Offer>('Offer', offerSchema)

