import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["unread", "read", "replied"], default: "unread" },
  },
  { timestamps: true }
);

const MongooseContactModel = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

const ContactModelWrapper = {
  create: async (data: any) => {
    if (global.isMockMode) {
      const newContact = {
        _id: "mock-contact-" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        status: "unread",
        ...data,
      };
      global.mockDb!.contacts.push(newContact);
      return newContact;
    }
    return MongooseContactModel.create(data);
  },
  find: (query?: any) => {
    if (global.isMockMode) {
      const contacts = [...global.mockDb!.contacts];
      return {
        sort: (sortQuery: any) => {
          return {
            then: (callback: any) => callback(contacts),
          };
        },
        then: (callback: any) => callback(contacts),
      } as any;
    }
    return MongooseContactModel.find(query);
  }
};

export default ContactModelWrapper as any;
