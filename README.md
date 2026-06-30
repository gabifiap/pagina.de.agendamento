# 💈 MODELO - Sistema de Agendamento Online

Sistema completo de agendamento para comércios, com reserva de horário pelo cliente em tempo real e painel administrativo para o dono do negócio.

🔗 **Interface ao vivo:** [inquisitive-panda-a8b0a9.netlify.app](https://inquisitive-panda-a8b0a9.netlify.app)

<img width="1341" height="647" alt="image" src="https://github.com/user-attachments/assets/92e14781-b201-4a2f-9f47-c730cb01dc2d" />

<img width="495" height="417" alt="image" src="https://github.com/user-attachments/assets/6156b9b6-2c97-4e18-80a0-7681b16ac41d" />


## ✨ Funcionalidades

- Fluxo de agendamento em 4 etapas: serviço → data → horário → dados do cliente
- Calendário interativo com horários disponíveis em tempo real
- **Trava anti-conflito**: o banco de dados impede que dois clientes reservem o mesmo horário, mesmo em caso de cliques simultâneos
- Painel administrativo protegido por login, com listagem dos agendamentos
- **Notificação automática por e-mail** ao dono sempre que um novo agendamento é confirmado
- Identidade visual própria (não é um template genérico) inspirada na estética clássica de barbearia

## 🛠️ Stack técnica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Estilização | CSS |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| E-mail transacional | Resend |
| Calendário | react-day-picker |
| Deploy | Netlify |

## 🔒 Segurança

- Todas as tabelas usam **Row Level Security (RLS)** no Supabase — sem regras explícitas, ninguém acessa nada
- Restrição de banco (`unique constraint`) impede agendamentos duplicados, independente do que o frontend permita
- Chaves sensíveis (API keys) nunca expostas no código-fonte, gerenciadas via variáveis de ambiente

## 🚀 Como rodar localmente

```bash
git clone https://github.com/gabifiap/pagina.de.agendamento.git
cd pagina.de.agendamento
npm install
```

Crie um arquivo `.env.local` na raiz com:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
RESEND_API_KEY=sua_chave_aqui
```

```bash
npm run dev
```

---

