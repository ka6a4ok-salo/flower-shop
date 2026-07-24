"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/admin-actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="font-display text-3xl text-green">Флёр</span>
          <p className="mt-1 text-sm text-ink-soft">Панель управления</p>
        </div>

        <form
          action={action}
          className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8"
        >
          <label className="block">
            <span className="text-sm font-medium text-ink">Пароль</span>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-blush"
              placeholder="Введите пароль"
            />
          </label>

          {state.error && (
            <p className="mt-3 rounded-lg bg-blush-soft px-3 py-2 text-sm text-blush">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-green font-medium text-cream transition-all hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Проверяем…" : "Войти"}
          </button>

          <p className="mt-4 text-center text-xs text-ink-soft">
            Демо-доступ: пароль <code className="text-blush">admin123</code>
          </p>
        </form>
      </div>
    </div>
  );
}
