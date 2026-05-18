import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  benefits: string[];
  ingredients: string[];
  nutrition: {
    calories: string;
    carbs: string;
    caffeine: string;
    sugar: string;
  };
  image: string;
  colorTheme: "cyan" | "orange" | "purple";
  inStock: boolean;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: "Elixir" },
    benefits: [{ type: String }],
    ingredients: [{ type: String }],
    nutrition: {
      calories: { type: String, default: "15 kcal" },
      carbs: { type: String, default: "3g" },
      caffeine: { type: String, default: "150mg" },
      sugar: { type: String, default: "0g" },
    },
    image: { type: String, required: true },
    colorTheme: { type: String, enum: ["cyan", "orange", "purple"], default: "cyan" },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MongooseProductModel = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

const ProductModelWrapper = {
  find: (query?: any) => {
    if (global.isMockMode) {
      const products = [...global.mockDb!.products];
      return {
        sort: (sortQuery: any) => {
          return {
            then: (callback: any) => callback(products),
          };
        },
        then: (callback: any) => callback(products),
      } as any;
    }
    return MongooseProductModel.find(query);
  },
  create: async (data: any) => {
    if (global.isMockMode) {
      if (Array.isArray(data)) {
        const createdList = data.map((item) => ({
          _id: "mock-prod-" + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          ...item,
        }));
        global.mockDb!.products.push(...createdList);
        return createdList;
      }
      const newProduct = {
        _id: "mock-prod-" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...data,
      };
      global.mockDb!.products.push(newProduct);
      return newProduct;
    }
    return MongooseProductModel.create(data);
  },
  findByIdAndUpdate: async (id: any, data: any, options?: any) => {
    if (global.isMockMode) {
      const index = global.mockDb!.products.findIndex((p: any) => p._id === id);
      if (index !== -1) {
        const updateFields = data.$set ? data.$set : data;
        global.mockDb!.products[index] = {
          ...global.mockDb!.products[index],
          ...updateFields,
        };
        return global.mockDb!.products[index];
      }
      return null;
    }
    return MongooseProductModel.findByIdAndUpdate(id, data, options);
  },
  findByIdAndDelete: async (id: any) => {
    if (global.isMockMode) {
      const index = global.mockDb!.products.findIndex((p: any) => p._id === id);
      if (index !== -1) {
        const removed = global.mockDb!.products.splice(index, 1)[0];
        return removed;
      }
      return null;
    }
    return MongooseProductModel.findByIdAndDelete(id);
  }
};

export default ProductModelWrapper as any;
