"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Agendamento = {
  id: string;
  cliente_nome: string;
  cliente_contato: string;
  data: string;
  hora_inicio: string;
  status: string;
  servicos: { nome: string } | null;
};

export default function Admin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function verificarSessao() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }
      carregarAgendamentos();
    }
    verificarSessao();
  }, []);

  async function carregarAgendamentos() {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("id, cliente_nome, cliente_contato, data, hora_inicio, status, servicos(nome)")
      .order("data")
      .order("hora_inicio");

    if (!error && data) setAgendamentos(data as unknown as Agendamento[]);
    setCarregando(false);
  }

  async function handleSair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-stone-950 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-red-500">
            Painel do dono
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-stone-50">
            Agendamentos
          </h1>
        </div>
        <button
          onClick={handleSair}
          className="rounded-sm border border-stone-700 px-4 py-2 font-[family-name:var(--font-mono)] text-sm uppercase text-stone-300 hover:border-stone-500"
        >
          Sair
        </button>
      </div>

      {carregando && <p className="mt-8 text-stone-400">Carregando...</p>}

      {!carregando && agendamentos.length === 0 && (
        <p className="mt-8 text-stone-400">Nenhum agendamento ainda.</p>
      )}

      <div className="mt-8 space-y-3">
        {agendamentos.map((ag) => (
          <div
            key={ag.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-stone-800 bg-stone-900 p-4"
          >
            <div>
              <p className="font-semibold text-stone-50">{ag.cliente_nome}</p>
              <p className="text-sm text-stone-400">
                {ag.servicos?.nome} · {ag.cliente_contato}
              </p>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-amber-400">
              {new Date(ag.data + "T00:00:00").toLocaleDateString("pt-BR")} às {ag.hora_inicio}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}