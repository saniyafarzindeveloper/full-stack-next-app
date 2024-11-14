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
