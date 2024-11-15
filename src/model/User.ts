import mongoose, { Schema, Document } from "mongoose";
//document is used for type safety is TS

//message interface
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

//MessageSchema needs to be defined as schema as it is a custom schema which contains multiple values rather than a singlr data type
//just for type safety
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


export interface User extends Document {
 username: string;
 email: string;
 password: string;
 verifyCode: string;
 verifyCodeExpiry: Date;
 isAcceptingMessage: boolean;
 message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true
  },
  email:{
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid e-mail']
  }
});