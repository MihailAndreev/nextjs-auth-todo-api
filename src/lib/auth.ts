import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
const jwtExpiresIn = "1d";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function signToken(username: string): string {
  return jwt.sign({ username }, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function getUsernameFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");

  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = header.slice(7).trim();

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload | string;
    if (typeof payload === "string") {
      return null;
    }
    if (typeof payload.username !== "string") {
      return null;
    }

    return payload.username;
  } catch {
    return null;
  }
}
