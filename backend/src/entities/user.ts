import mongoose, { Types } from 'mongoose'

export interface User {
  _id: Types.ObjectId
  code: string
  name: string
  email: string
  password: string
  occupation: string
  avatar: string
  avatarURL: string
  teacher: Types.ObjectId | User
  createdAt: Date
  warningsAmount: number
}

const userSchema = new mongoose.Schema({
  code: { type: String, default: null },
  name: { type: String, default: null, required: true },
  email: { type: String, default: null, required: true },
  password: { type: String, default: null, required: true },
  occupation: { type: String, default: null, required: true },
  avatar: { type: String, default: null },
  avatarURL: { type: String, default: null },
  teacher: { type: 'ObjectId', ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  warningsAmount: { type: Number, default: 0 },
})

export const UserModel = mongoose.model<User>('User', userSchema)




/*

{
  _id: '65e6421e5d7e2314d26a6aa3',
  code: '1',
  name: 'João',
  email: 'joao@gmail.com',
  password: '$2b$10$87rSYt.r32Vxzn06AKMotej1XfOWGcXc/NZzchPI2N25y9UPeCOP2',
  occupation: 'student',
  avatar: null,
  avatarURL: null,
  teacher: '65e641c85d7e2314d26a6a82',
  warningsAmount: 1,
  createdAt: '2024-03-04T21:50:22.772Z',
  __v: 0
}



*/