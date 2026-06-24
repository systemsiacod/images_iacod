# Planejamento — Plataforma de Pagamentos USDT (modelo TCR Finance)

> Documento de negócio para constituição de uma fintech B2B de câmbio e pagamentos
> globais usando stablecoins (USDT/USDC) como "trilho" de liquidação.
>
> **Aviso:** Este material é um plano de negócios e técnico. Não é consultoria
> jurídica, contábil ou financeira. Antes de operar, contrate advogado
> especializado em fintech/cripto e contador. Operar câmbio e ativos virtuais no
> Brasil é atividade **regulada** (BCB + COAF).

---

## 1. O que a TCR faz (e o que vamos replicar)

A TCR Finance não é uma corretora de varejo. É uma **fintech de pagamentos
globais e câmbio corporativo (B2B)** que usa um modelo híbrido:

- Conecta o sistema bancário tradicional (SWIFT/PIX) com a blockchain.
- Usa stablecoins (USDT/USDC) como **ponte de liquidação** para mover valor
  entre países em minutos, com custo menor que o câmbio bancário.
- Oferece recebimento em cripto para lojistas, com liquidação em BRL.

O que vamos construir é uma plataforma com as mesmas capacidades centrais:

1. **Conversão BRL ↔ USDT** com cotação e spread.
2. **Remessa internacional** (BRL → USDT → moeda/destino).
3. **Recebimento para lojistas** (cripto → BRL).
4. **Carteiras corporativas** multi-moeda (BRL, USDT, USDC).
5. **API B2B** para empresas integrarem ao próprio sistema/ERP.

> ⚠️ **TCR ≠ TRC-20.** TCR é o nome da empresa; TRC-20 é a rede da Tron usada
> para transferir USDT com taxa baixa. Nossa plataforma usaria redes como
> TRC-20, ERC-20 e outras "nos bastidores".

---

## 2. Burocracia e requisitos legais (Brasil)

Marco legal principal: **Lei 14.478/2022** (marco legal das criptomoedas) +
**Resolução BCB 316/2023** e normas correlatas, que colocam as prestadoras de
serviços de ativos virtuais (**VASP / PSAV**) sob supervisão do Banco Central.

| Etapa | Órgão | Detalhe |
|---|---|---|
| Constituição da empresa | Junta Comercial | LTDA ou S/A; objeto social com "prestação de serviços de ativos virtuais" e/ou IP de câmbio |
| Autorização VASP/PSAV | Banco Central (BCB) | Necessária para operar profissionalmente com ativos virtuais |
| Autorização de câmbio | BCB | Se for operar câmbio (BRL↔USD), enquadramento como instituição autorizada ou parceria com IP/banco |
| Registro e PLD-FT | COAF + BCB | Programa de Prevenção à Lavagem de Dinheiro; reporte de operações suspeitas/acima de limites |
| KYC/KYB | Interno + provedores | Onboarding com verificação de identidade (PF) e empresarial (PJ) |
| LGPD | ANPD | Política de privacidade, encarregado (DPO), base legal para dados de KYC |
| CNAE | Receita Federal | Ex.: 6499-9/99, 6438-7/01 ou correlatos de fintech/pagamentos |
| Conta bancária PJ | Banco parceiro | Banco com apetite para cripto (ex.: BTG, BS2, Genial) |
| Auditoria | Auditor independente | Demonstrações e controles; exigência conforme porte/autorização |

**Caminhos de entrada no mercado (do mais rápido ao mais completo):**

1. **Parceria / BaaS:** operar "em cima" de uma instituição já autorizada
   (Banking/Crypto-as-a-Service). Mais rápido, menor custo regulatório, divide
   margem com o parceiro. **Recomendado para começar.**
2. **Autorização própria:** pedir autorização de VASP/IP ao BCB. Mais caro e
   demorado (meses), porém maior margem e autonomia no médio prazo.

---

## 3. Investimento inicial estimado

Cenário "começar via parceria/BaaS" (mais enxuto):

| Item | Custo estimado (R$) |
|---|---|
| Constituição jurídica + advogado especializado | 15.000 |
| Compliance/PLD (consultoria + officer PJ) | 8.000 / mês |
| Setup integração com parceiro BaaS/custódia | 10.000–30.000 |
| Desenvolvimento da plataforma (MVP) | 80.000–150.000 |
| Infraestrutura cloud + monitoramento | 3.000 / mês |
| Marketing e vendas iniciais | 20.000 |
| **Capital de giro / liquidez em USDT** | 200.000–500.000 |
| **Total para operar ~12 meses** | **~R$ 400 mil – 700 mil** |

> O **capital de giro em USDT** costuma ser o maior item: você precisa de
> liquidez para liquidar conversões na hora (atuar como formador de mercado).
> Com parceria de liquidez, esse valor cai.

---

## 4. Como a plataforma fatura

| Fonte de receita | Como funciona | Margem típica |
|---|---|---|
| **Spread cambial** | Compra USDT a X, vende a X+spread | 1,5%–3% por operação |
| **Taxa por transação** | Valor fixo por operação enviada | R$ 5–50 |
| **Assinatura (SaaS)** | Mensalidade por uso da plataforma/painel | R$ 500–5.000 / mês |
| **API B2B por volume** | Empresas que integram pagam por volume | 0,5%–1% do volume |
| **Remessa (importação)** | BRL → USDT → USD/destino | 1%–2,5% |
| **Recebimento lojista** | Cripto → BRL em D+0 | 1%–1,5% + taxa fixa |

**Simulação rápida:**
50 empresas × R$ 500 mil/mês de volume = **R$ 25 mi/mês**.
Spread médio 1,5% ⇒ **~R$ 375 mil/mês de receita bruta**.
Mesmo com 50% de custo (liquidez, parceiro, infra), sobra margem relevante.

---

## 5. Viabilidade frente a ~20 concorrentes

**Veredito: viabilidade ALTA**, com diferenciação por nicho e atendimento — não
por "tecnologia pura" (que vira commodity).

| Segmento | Players de referência | Onde dá para ganhar |
|---|---|---|
| Remessa internacional | TCR Finance, Belo, Transfero | Atendimento dedicado a PMEs |
| Pagamento de importação | BS2 Cripto, Foxbit Business | Integração com ERP nacional |
| Recebimento lojista | Mercado Pago Cripto, players cripto | Liquidação D+0, taxa clara |
| Câmbio B2B | Braza, Novadax Business | Spread menor + relacionamento |

O mercado de fluxo cripto B2B no Brasil é grande e ainda **sub-servido**; 20
players não saturam a demanda. A chave é escolher um **nicho** inicial com dor
clara e baixa concorrência:

- **Agronegócio / exportadores de commodities**
- **Importadores de tecnologia/eletrônicos**
- **Prestadores de serviço que recebem do exterior (PJ/freelancers)**
- **Marketplaces com vendedores internacionais**

---

## 6. Plano de captação de clientes

**Fase 1 — 0 a 90 dias (primeiros 10 clientes):**
- Venda consultiva direta (founder-led sales) em grupos/associações de
  importadores e exportadores.
- Lista de empresas-alvo do nicho escolhido + abordagem 1:1 (LinkedIn, eventos).
- Oferta de "spread promocional" para os primeiros clientes-âncora.

**Fase 2 — 3 a 9 meses (escala inicial):**
- Conteúdo educativo (comparativo de custo vs. banco; calculadora de economia).
- Parcerias com contadores e despachantes aduaneiros (indicação por comissão).
- Programa de indicação entre empresas.

**Fase 3 — 9+ meses (crescimento):**
- Integrações/marketplace com ERPs e plataformas de e-commerce.
- Time de inside sales + SDR.
- Estudos de caso públicos com economia comprovada dos clientes-âncora.

**Métricas-chave:** CAC, volume médio por cliente, take rate (spread+taxas),
churn, e LTV. Meta inicial saudável: LTV/CAC ≥ 3.

---

## 7. Roadmap do produto (técnico)

| Fase | Entregáveis |
|---|---|
| **MVP (este repositório)** | Painel B2B, motor de cotação BRL/USDT, conversão, remessa, histórico, carteiras, KYC simulado, API REST |
| **V1** | Integração real com custódia/exchange para liquidez; on/off-ramp PIX; webhooks |
| **V2** | KYC/KYB automatizado, PLD-FT, antifraude, conciliação contábil |
| **V3** | Multi-rede on-chain (TRC-20/ERC-20), liquidação on-chain, app lojista |

> **Importante:** o MVP neste repositório é uma **simulação funcional** das
> regras de negócio (cotação, spread, carteiras, transações). Ele **não** move
> dinheiro ou cripto reais e **não** substitui as licenças regulatórias. Serve
> para validar produto, demonstrar para investidores/clientes e servir de base
> para a integração com parceiros licenciados.

---

## 8. Próximos passos práticos

1. Definir o **nicho-âncora** (ex.: importadores de tecnologia).
2. Escolher o **parceiro BaaS/custódia** para liquidez e on/off-ramp.
3. Validar o MVP com 3–5 empresas do nicho (piloto).
4. Iniciar o processo de **compliance/PLD** e a estratégia regulatória (parceria
   vs. autorização própria).
5. Evoluir o MVP para V1 com liquidação real via parceiro.
