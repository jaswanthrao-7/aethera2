import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "aethera-super-secret-quantum-crypto-key-2026";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

// Hash password using bcryptjs
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Sign JWT Token (24h expiration)
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

// Verify JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Extract JWT token from Request headers or cookies
export function getJwtFromRequest(req: Request): string | null {
  // Check Authorization header: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check Cookies: cookie is "token=<token>"
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce((acc, current) => {
      const [name, value] = current.trim().split("=");
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    if (cookies.token) {
      return cookies.token;
    }
  }

  return null;
}

// Get user info from request JWT
export function getUserFromRequest(req: Request): JWTPayload | null {
  const token = getJwtFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

// Route protector: Ensure request comes from an authenticated Admin
export function verifyAdmin(req: Request): JWTPayload | null {
  const user = getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}
