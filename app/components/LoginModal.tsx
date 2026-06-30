"use client";

import { LockKeyhole, Server } from "lucide-react";
import { FormEvent, useState } from "react";
import { login } from "../lib/api";

type LoginModalProps = {
  onLogin: () => void;
};

export default function LoginModal({ onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login(username, password);
      onLogin();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Error al iniciar sesion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 project-overlay">
      <form
        onSubmit={handleSubmit}
        className="panel project-modal w-full max-w-md rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/8 bg-[#161616] text-zinc-200">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-medium text-zinc-100">Nexo Lab</p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Inicia sesion para conectar con el backend interno.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <label className="grid gap-2 text-sm">
            <span className="text-zinc-400">Usuario</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-zinc-100 outline-none transition focus:border-white/18"
              autoComplete="username"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-zinc-400">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-zinc-100 outline-none transition focus:border-white/18"
              type="password"
              autoComplete="current-password"
            />
          </label>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LockKeyhole className="h-4 w-4" />
          {isSubmitting ? "Conectando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
