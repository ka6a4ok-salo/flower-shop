import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const COOKIE = "fleur_admin";

// Подписанное значение сессии. Пароль в открытом виде в cookie не хранится —
// хранится HMAC-подпись, которую невозможно подделать без AUTH_SECRET.
function sessionToken(): string {
  const secret = process.env.AUTH_SECRET ?? "dev-secret";
  return crypto
    .createHmac("sha256", secret)
    .update("fleur-admin-session-v1")
    .digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === sessionToken();
}

// Вызывается только из Server Action / Route Handler
export async function login(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD ?? "admin123";
  if (password !== expected) return false;
  const store = await cookies();
  store.set(COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // неделя
    secure: process.env.NODE_ENV === "production",
  });
  return true;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

// Защита страниц админки: перенаправляет на вход, если сессии нет
export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}
