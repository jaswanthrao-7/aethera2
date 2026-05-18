import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const MongooseUserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

const UserModelWrapper = {
  findOne: async (query: any) => {
    if (global.isMockMode) {
      if (query.email) {
        return global.mockDb!.users.find((u: any) => u.email.toLowerCase() === query.email.toLowerCase()) || null;
      }
      return null;
    }
    return MongooseUserModel.findOne(query);
  },
  create: async (data: any) => {
    if (global.isMockMode) {
      const newUser = {
        _id: "mock-user-" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...data,
      };
      global.mockDb!.users.push(newUser);
      return newUser;
    }
    return MongooseUserModel.create(data);
  },
  findById: (id: any) => {
    if (global.isMockMode) {
      const user = global.mockDb!.users.find((u: any) => u._id === id) || null;
      return {
        select: (fields: string) => {
          return {
            then: (callback: any) => callback(user),
          };
        },
        then: (callback: any) => callback(user),
      } as any;
    }
    return MongooseUserModel.findById(id);
  },
  find: (query?: any) => {
    if (global.isMockMode) {
      const users = [...global.mockDb!.users];
      const resultObj = {
        select: (fields: string) => {
          return {
            sort: (sortQuery: any) => {
              return {
                then: (callback: any) => callback(users),
              };
            },
            then: (callback: any) => callback(users),
          };
        },
        sort: (sortQuery: any) => {
          return {
            then: (callback: any) => callback(users),
          };
        },
        then: (callback: any) => callback(users),
      };
      return resultObj as any;
    }
    return MongooseUserModel.find(query);
  },
  findByIdAndDelete: async (id: any) => {
    if (global.isMockMode) {
      const index = global.mockDb!.users.findIndex((u: any) => u._id === id);
      if (index !== -1) {
        const removed = global.mockDb!.users.splice(index, 1)[0];
        return removed;
      }
      return null;
    }
    return MongooseUserModel.findByIdAndDelete(id);
  }
};

export default UserModelWrapper as any;
