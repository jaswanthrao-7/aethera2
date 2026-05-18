import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("⚠️ [AETHERA] Warning: MONGODB_URI is not defined. Defaulting to holographic in-memory fallback database.");
}

/**
 * Global is used here to maintain a cached connection across hot-reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
  // eslint-disable-next-line no-var
  var isMockMode: boolean | undefined;
  // eslint-disable-next-line no-var
  var mockDb: {
    users: any[];
    products: any[];
    contacts: any[];
  } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

// Initialize global mock database
if (!global.mockDb) {
  global.mockDb = {
    users: [],
    products: [
      {
        _id: "mock-prod-1",
        name: "Aethera Origin",
        description: "The baseline cognitive adaptogen matrix. Restores neuro-chemical equilibrium, stabilizes cortisol, and enhances sustained spatial focus using premium organic elements.",
        price: 49.99,
        category: "Elixir",
        benefits: ["Boosts Spatial Memory", "Amplifies Mental Clarity", "Sustained Cognitive Calm", "No Caffeine Crash"],
        ingredients: ["Alpha-GPC (300mg)", "Lion's Mane Extract (500mg)", "L-Theanine (200mg)", "CoQ10 (50mg)", "Vitamin B6 & B12"],
        nutrition: { calories: "10 kcal", carbs: "2g", caffeine: "0mg (Decaf)", sugar: "0g" },
        image: "/images/can-origin.png",
        colorTheme: "cyan",
        inStock: true,
        createdAt: new Date(),
      },
      {
        _id: "mock-prod-2",
        name: "Aethera Ignite",
        description: "A high-performance neural accelerator designed for explosive physical endurance, reflex speed, and high-intensity energy. Infused with natural Green Tea Caffeine, Cordyceps Militaris, and Ginkgo Biloba. Tastes like cyber citrus and blood orange.",
        price: 54.99,
        category: "Elixir",
        benefits: ["Explosive Physical Energy", "Accelerated Reflex Speed", "Increased VO2 Max Efficiency", "Mitochondrial Activation"],
        ingredients: ["Natural Green Tea Caffeine (150mg)", "Cordyceps Extract (600mg)", "Ginkgo Biloba (120mg)", "L-Tyrosine (500mg)", "Rhodiola Rosea"],
        nutrition: { calories: "15 kcal", carbs: "3g", caffeine: "150mg", sugar: "0g" },
        image: "/images/can-ignite.png",
        colorTheme: "orange",
        inStock: true,
        createdAt: new Date(),
      },
      {
        _id: "mock-prod-3",
        name: "Aethera Zenith",
        description: "A luxurious neural recovery matrix formulated to achieve the flow state, reduce anxiety, and unlock deep creative visualization cycles. Enriched with KSM-66 Ashwagandha, Reishi Mushroom, and Magnesium L-Threonate. Tastes like twilight lavender and blue lotus flower.",
        price: 59.99,
        category: "Elixir",
        benefits: ["Induces Flow State", "Mitigates Cortisol & Stress", "Stimulates Subconscious Creativity", "Optimizes Neural Repair"],
        ingredients: ["KSM-66 Ashwagandha (400mg)", "Reishi Spore Extract (500mg)", "Magnesium L-Threonate (150mg)", "5-HTP (100mg)", "L-Glycine (1g)"],
        nutrition: { calories: "12 kcal", carbs: "2g", caffeine: "0mg (Decaf)", sugar: "0g" },
        image: "/images/can-zenith.png",
        colorTheme: "purple",
        inStock: true,
        createdAt: new Date(),
      }
    ],
    contacts: [],
  };
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    global.isMockMode = true;
    return null;
  }

  if (global.isMockMode) {
    return null;
  }

  if (cached && cached.conn) {
    return cached.conn;
  }

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    if (cached) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    console.warn("\n🚨 [AETHERA] MongoDB Offline: Calibrating Holographic In-Memory Database Fallback!\n");
    global.isMockMode = true;
    if (cached) {
      cached.promise = null;
    }
    return null; // Resolve successfully in mock mode so pages don't crash
  }

  return cached?.conn;
}
