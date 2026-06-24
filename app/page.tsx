"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { supabase } from "@/lib/supabase";

type Servico = {
  id: string;
  nome: string;
  duracao_minutos: number;
  preco: number;
};

const horarios = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export default function Home() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selecionado, setSelecionado] = useState<Servico | null>(null);
  const [data, setData] = useState<Date | undefined>(undefined);
  const [horario, setHorario] = useState<string | null>(null);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [contato, setContato] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

useEffect(() => {
    async function carregarServicos() {
      const { data, error } = await supabase.from("servicos").select("*").order("preco");
      console.log("SERVICOS:", data, error);
      if (!error && data) setServicos(data);
    }
    carregarServicos();
  }, []);

  useEffect(() => {
    async function carregarHorariosOcupados() {
      if (!data) {
        setHorariosOcupados([]);
        return;
      }
      const dataFormatada = data.toISOString().slice(0, 10);
      const { data: ocupados, error } = await supabase
        .from("horarios_ocupados")
        .select("hora_inicio")
        .eq("data", dataFormatada);

      if (!error && ocupados) {
        setHorariosOcupados(ocupados.map((o) => o.hora_inicio.slice(0, 5)));
      }
    }
    carregarHorariosOcupados();
  }, [data]);

  async function handleConfirmar() {
    if (!nomeCliente || !contato) {
      setErro("Preenche seu nome e contato antes de confirmar.");
      return;
    }
    if (!selecionado || !data || !horario) return;

    setEnviando(true);
    setErro(null);

    const dataFormatada = data.toISOString().slice(0, 10);

    const { error } = await supabase.from("agendamentos").insert({
      servico_id: selecionado.id,
      cliente_nome: nomeCliente,
      cliente_contato: contato,
      data: dataFormatada,
      hora_inicio: horario,
    });

    setEnviando(false);

    if (error) {
      if (error.code === "23505") {
        setErro("Esse horário acabou de ser reservado por outra pessoa. Escolhe outro horário.");
        setHorario(null);
        const { data: ocupados } = await supabase
          .from("horarios_ocupados")
          .select("hora_inicio")
          .eq("data", dataFormatada);
        if (ocupados) setHorariosOcupados(ocupados.map((o) => o.hora_inicio.slice(0, 5)));
      } else {
        setErro("Não foi possível confirmar. Tenta de novo em alguns segundos.");
      }
      return;
    }

    setConfirmado(true);
  }

  if (confirmado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950 p-8">
        <div className="relative w-full max-w-sm bg-[#EDE6D6] p-8">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-stone-500">
            Comprovante de agendamento
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-stone-900">
            Barbearia do Paulo
          </h1>
          <div className="my-4 border-t border-dashed border-stone-400" />
          <p className="text-stone-700">
            Cliente: <span className="font-semibold">{nomeCliente}</span>
          </p>
          <p className="text-stone-700">
            Serviço: <span className="font-semibold">{selecionado?.nome}</span>
          </p>
          <p className="text-stone-700">
            Data: <span className="font-semibold">{data?.toLocaleDateString("pt-BR")}</span>
          </p>
          <p className="text-stone-700">
            Horário: <span className="font-semibold">{horario}</span>
          </p>
          <div className="absolute -right-4 -top-4 flex h-20 w-20 -rotate-12 items-center justify-center rounded-full border-4 border-red-600 text-center font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase leading-tight tracking-wide text-red-600">
            Confirmado
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950">
      <header className="px-8 py-10">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-red-500">
          Agendamento online
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl uppercase tracking-wide text-stone-50">
          Barbearia do Paulo
        </h1>
      </header>

      <div className="h-3 w-full bg-[repeating-linear-gradient(45deg,#C1402B_0px,#C1402B_24px,#EDE6D6_24px,#EDE6D6_48px,#1B2A3A_48px,#1B2A3A_72px)]" />

      <section className="px-8 py-10">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-red-500">
          Etapa 1 — Serviço
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-stone-50">
          Escolha o serviço
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {servicos.map((servico) => (
            <div
              key={servico.id}
              onClick={() => setSelecionado(servico)}
              className={`relative cursor-pointer rounded-sm border p-5 transition ${
                selecionado?.id === servico.id
                  ? "border-red-500 bg-stone-900"
                  : "border-stone-800 bg-stone-900 hover:border-stone-600"
              }`}
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg text-stone-50">
                {servico.nome}
              </h3>
              <p className="mt-1 text-sm text-stone-500">{servico.duracao_minutos} min</p>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-2xl text-amber-400">
                R$ {servico.preco}
              </p>
            </div>
          ))}
        </div>
      </section>

      {selecionado && (
        <section className="px-8 py-10">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-red-500">
            Etapa 2 — Data
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-stone-50">
            Escolha o dia
          </h2>
          <div
            className="mt-6 inline-block rounded-sm border-2 border-amber-400/30 bg-[#EDE6D6] p-3 [&_.rdp-day_button]:!text-stone-800 [&_.rdp-weekday]:!text-stone-500 [&_.rdp-caption_label]:!text-stone-700 [&_.rdp-chevron]:!fill-stone-700"
            style={{ "--rdp-accent-color": "#C1402B" } as React.CSSProperties}
          >
            <DayPicker mode="single" selected={data} onSelect={setData} />
          </div>
        </section>
      )}

      {data && (
        <section className="px-8 py-10">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-red-500">
            Etapa 3 — Horário
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-stone-50">
            Escolha o horário
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {horarios.map((h) => {
              const ocupado = horariosOcupados.includes(h);
              return (
                <button
                  key={h}
                  onClick={() => !ocupado && setHorario(h)}
                  disabled={ocupado}
                  className={`rounded-sm border px-4 py-2 font-[family-name:var(--font-mono)] text-sm transition ${
                    ocupado
                      ? "cursor-not-allowed border-stone-800 bg-stone-900 text-stone-600 line-through"
                      : horario === h
                      ? "border-red-500 bg-red-500 text-stone-50"
                      : "border-stone-700 bg-stone-900 text-stone-300 hover:border-stone-500"
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {horario && (
        <section className="px-8 py-10">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-red-500">
            Etapa 4 — Seus dados
          </p>
          <h2 className="mb-6 mt-1 font-[family-name:var(--font-display)] text-2xl text-stone-50">
            Confirme seu agendamento
          </h2>
          <div className="max-w-sm">
            <input
              type="text"
              placeholder="Seu nome"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              className="mb-4 w-full border-b-2 border-stone-700 bg-transparent py-2 text-stone-50 placeholder-stone-500 focus:border-red-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Telefone ou e-mail"
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              className="mb-2 w-full border-b-2 border-stone-700 bg-transparent py-2 text-stone-50 placeholder-stone-500 focus:border-red-500 focus:outline-none"
            />
            {erro && <p className="mb-4 text-sm text-red-400">{erro}</p>}
            <button
              onClick={handleConfirmar}
              disabled={enviando}
              className="mt-4 w-full rounded-sm bg-red-500 py-3 font-[family-name:var(--font-mono)] uppercase tracking-wide text-stone-50 transition hover:bg-red-400 disabled:opacity-60"
            >
              {enviando ? "Confirmando..." : "Confirmar agendamento"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}