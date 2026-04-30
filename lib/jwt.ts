import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "academik-dev-secret";
export interface JWTPayload { userId: number; email: string; role: string; }
export const signToken = (p: JWTPayload) => jwt.sign(p, SECRET, { expiresIn: "7d" });
export const verifyToken = (t: string): JWTPayload | null => { try { return jwt.verify(t, SECRET) as JWTPayload; } catch { return null; } };
export function getTokenFromRequest(req: Request): JWTPayload | null { const h = req.headers.get("authorization"); if (!h?.startsWith("Bearer ")) return null; return verifyToken(h.slice(7)); }