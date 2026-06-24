"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setCarregando(true);
    setErro(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-950 p-8">
      <div className="w-full max-w-sm">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-red-500">
          Painel do dono
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-stone-50">
          Entrar
        </h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 mt-6 w-full border-b-2 border-stone-700 bg-transparent py-2 text-stone-50 placeholder-stone-500 focus:border-red-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mb-2 w-full border-b-2 border-stone-700 bg-transparent py-2 text-stone-50 placeholder-stone-500 focus:border-red-500 focus:outline-none"
        />
        {erro && <p className="mb-4 text-sm text-red-400">{erro}</p>}
        <button
          onClick={handleLogin}
          disabled={carregando}
          className="mt-4 w-full rounded-sm bg-red-500 py-3 font-[family-name:var(--font-mono)] uppercase tracking-wide text-stone-50 transition hover:bg-red-400 disabled:opacity-60"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </main>
  );
}