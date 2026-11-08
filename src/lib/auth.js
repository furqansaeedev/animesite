import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "fallback_secret_key_aime_123";
const key = new TextEncoder().encode(secretKey);

// Encrypt the session data into a JWT
export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days
    .sign(key);
}

// Decrypt the JWT back to session data
export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// Get the current user from the HTTP-only cookie
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("aime_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// Set the session cookie
export async function setSession(user) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ user, expires });

  const cookieStore = await cookies();
  cookieStore.set("aime_session", session, {
    expires,
    httpOnly: true, // Prevents client-side JS from reading it (Security)
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

// Clear the session cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set("aime_session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}