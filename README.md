# StablePay — Plataforma B2B de pagamentos com USDT (modelo TCR)

MVP de uma fintech de **câmbio e pagamentos globais para empresas** que usa
stablecoins (USDT/USDC) como trilho de liquidação — o mesmo modelo da TCR
Finance. Inclui o **planejamento de negócio** e uma **plataforma funcional**
(Next.js) que demonstra as regras centrais: cotação com spread, conversão
BRL ↔ USDT, remessa, recebimento de lojista, carteiras corporativas, KYC e uma
API REST B2B.

> ⚠️ **Aviso:** protótipo demonstrativo. **Não** movimenta dinheiro ou cripto
> reais e **não** substitui as licenças regulatórias (BCB/COAF). Veja o
> planejamento para o caminho regulatório.

## 📄 Planejamento de negócio

O plano completo (burocracia/regulação, investimento, modelo de faturamento,
viabilidade frente aos concorrentes e plano de captação de clientes) está em:

**[`docs/PLANEJAMENTO.md`](docs/PLANEJAMENTO.md)**

## 🚀 Rodando o projeto

```bash
npm install
npm run dev      # http://localhost:3000
# ou produção:
npm run build && npm run start
```

A plataforma já vem com dados de exemplo (3 empresas com saldos e transações).
O store é um JSON local (`data/db.json`), recriado a partir do seed.

## 🧭 Páginas

| Rota | Descrição |
|---|---|
| `/` | Landing com calculadora de economia vs. banco |
| `/onboarding` | Abertura de conta corporativa (KYC/KYB) |
| `/dashboard` | Carteiras (BRL/USDT/USDC), saldo e atividade |
| `/convert` | Conversão/remessa com cotação em tempo real |
| `/transactions` | Histórico e métricas de receita da plataforma |

## 🔌 API REST

| Método | Rota | Função |
|---|---|---|
| `GET` | `/api/companies` | Lista empresas |
| `POST` | `/api/companies` | Cria empresa (`name`, `cnpj`, `email`, `segment`) |
| `GET` | `/api/companies/:id` | Empresa + carteiras |
| `POST` | `/api/companies/:id/kyc` | Atualiza KYC (`status`) |
| `GET` | `/api/wallets?companyId=` | Carteiras da empresa |
| `POST` | `/api/quote` | Cotação (`direction`, `amount`) |
| `GET` | `/api/transactions?companyId=` | Histórico |
| `POST` | `/api/transactions` | Executa conversão/remessa |
| `POST` | `/api/deposit` | On-ramp simulado (`companyId`, `currency`, `amount`) |

Exemplo de cotação:

```bash
curl -X POST http://localhost:3000/api/quote \
  -H 'Content-Type: application/json' \
  -d '{"direction":"BRL_TO_USDT","amount":50000}'
```

## 🧱 Arquitetura

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- `src/lib/pricing.ts` — motor de cotação/spread BRL↔USDT
- `src/lib/store.ts` — camada de dados (JSON; trocável por Postgres/Supabase)
- `src/app/api/*` — rotas REST
- `src/app/*` + `src/components/*` — UI

## 🗺️ Próximos passos (produção)

1. Integrar liquidez real (exchange/provedor) e on/off-ramp PIX.
2. KYC/KYB automatizado + PLD-FT + antifraude.
3. Liquidação on-chain multi-rede (TRC-20/ERC-20) e app do lojista.
4. Trilha regulatória (parceria BaaS ou autorização VASP no BCB).
