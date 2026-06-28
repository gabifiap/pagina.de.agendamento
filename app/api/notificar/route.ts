import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { nomeCliente, contato, servico, data, horario } = await request.json();

  try {
    await resend.emails.send({
      from: "Barbearia do Paulo <onboarding@resend.dev>",
      to: "batistagabi351@gmail.com",
      subject: `Novo agendamento: ${nomeCliente}`,
      html: `
        <h2>Novo agendamento confirmado!</h2>
        <p><strong>Cliente:</strong> ${nomeCliente}</p>
        <p><strong>Contato:</strong> ${contato}</p>
        <p><strong>Serviço:</strong> ${servico}</p>
        <p><strong>Data:</strong> ${data}</p>
        <p><strong>Horário:</strong> ${horario}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}