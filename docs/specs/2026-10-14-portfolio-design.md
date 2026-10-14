# Portfólio pessoal · design

Data: 2026-10-14 · Autor: D'Artagnan Romann de Mello (Darta) · Status: aprovado

## 1. Objetivo

Site portfólio pessoal do Darta. Público principal: recrutadores e empresas (conseguir o próximo
emprego como dev full stack pleno, com foco em sistemas e automações). Público secundário: clientes do negócio próprio de automação
de vendas (ainda sem nome).

**Critério de sucesso:** um recrutador que entra, rola 30 segundos e sai, sabe quem o Darta é, o que
ele entrega e como falar com ele. Metáfora de desktop e terminal são charme, nunca caminho obrigatório.

**Referência visual:** https://elenagonci.com/ (metáfora de desktop macOS, superpoderes com números
concretos). Inspiração, não cópia.

## 2. Idiomas

Bilíngue. `/` português, `/en` inglês. Primeira visita detecta pelo navegador; a escolha manual fica
salva (localStorage, com fallback silencioso). Troca por chave PT | EN na barra de menu ou `lang`
no terminal.

## 3. Estrutura da tela (desktop)

1. **Barra de menu** fixa no topo: "DR · D'Artagnan Romann · Tech Lead", chave PT | EN, relógio local.
2. **Mesa (primeira dobra):**
   - Hero em tipografia grande: "Eu sou o Darta. Construo sistemas que vão pra produção, e agentes
     que ajudam a construir." (EN equivalente.)
   - Pastas clicáveis no canto: Carmillion, Ovis, Favo OS, Agentes. Cada uma abre uma janela
     arrastável com o case.
3. **Dock** fixo embaixo: Terminal, Projetos, GitHub, Contato, CV. O gráfico de contribuições fica na mesa.
4. **Rolagem:**
   - 4 superpoderes (seção 5), cada um com 2 a 3 números.
   - Projetos em grade, incluindo paralelos (Revix, Infusio, Couplup e outros que o Darta liberar).
   - `sobre-mim.txt`: ANTES / AGORA / DEPOIS.
   - Contato: email, LinkedIn, GitHub, WhatsApp, agendar conversa.

**Celular:** a metáfora vira lista vertical (sem janelas arrastáveis, sem dock flutuante; dock vira
barra inferior simples). Terminal disponível como página cheia.

## 4. Terminal

Abre como janela flutuante pelo dock ou pela tecla `` ` ``.

| comando | saída |
|---|---|
| `help` | lista de comandos |
| `whoami` | resumo em 3 linhas |
| `superpoderes` (`superpowers` em EN) | os 4, com números |
| `projetos` / `projetos <nome>` | lista; com nome, abre o case |
| `stack` | tecnologias agrupadas |
| `contato` | email, LinkedIn, GitHub, WhatsApp |
| `cv` | baixa o PDF |
| `lang en` / `lang pt` | troca o idioma do site inteiro |
| `clear` | limpa |

Easter eggs: `sudo contratar` ("permissão concedida, falta só me mandar um email"), `ls agentes`
(lista a frota de agentes). Máximo 3.

Comportamento: histórico com ↑↓, Tab completa comando, comando desconhecido sugere `help`.
Comandos aceitam os nomes nos dois idiomas.

Acessibilidade: terminal tem `aria-label` próprio; todo conteúdo dele existe na página normal.
Leitor de tela e navegação por teclado não dependem do terminal.

## 5. Conteúdo

### Superpoderes

1. **Engenharia que vai pra produção.** Tech Lead do CRMillion (Carmillion): infra Docker Swarm +
   Traefik, deploy, Postgres/Prisma, integrações de WhatsApp. Números (seção 5.1).
2. **Agentes de IA no dia a dia.** Frota de agentes com papéis, Hermes autônomo numa VPS, sistema
   operacional pessoal com agentes. Números: a levantar (repos de agentes, rotinas rodando).
3. **Produto do zero.** Ovis (app de gestão de ovinocultura) e Favo OS (sistema interno de estúdio,
   Next.js + Supabase, com portal do cliente). Números: a levantar dos repos.
4. **Dev que vende.** Comercial da Favo, sócio em três negócios. Números: a confirmar com o Darta.

### 5.1 Números do CRMillion (congelados)

Fonte: git local, snapshot em `docs/dados/crmillion-numeros.md` (o GitHub da Carmillion já não
responde). Período 2026-03-20 a 2026-10-09.

- 805 commits (API 482, 55% do repo no período; App 323, 34%)
- 360 de 414 PRs do time mergeados pelo Darta (87%)
- +165 mil linhas
- 341 features, 297 fixes
- Integrações: WhatsApp Cloud API, ZapperHub, webhooks OLX, Mercado Livre, Messenger

### 5.2 Regras de conteúdo

- Uma fonte só: `content/pt.ts` e `content/en.ts`, mesmo tipo. Página, janelas e terminal leem dela.
- Nenhum número sem fonte. Todo número tem origem anotada em `docs/dados/`.
- Confidencialidade Carmillion: nenhum cliente pelo nome (usar "concessionárias e lojas de
  veículos"), nenhum código, só números agregados.
- Texto sem travessão.

### 5.3 Decisões de conteúdo (2026-10-14)

- **Trajetória** (fonte `docs/dados/linkedin.md`): B3dev (dez/2021 a mai/2025, full stack / PO),
  Sinosbyte (estágio ABAP, 2025), Saipos (full stack, set/2025 a mar/2026), Carmillion (Tech Lead,
  mar a out/2026), Infusio Studio (CTO, desde jan/2025). Alimenta o `sobre-mim.txt` e o CV.
- **CV:** gerado a partir do conteúdo, PT e EN, em PDF estático em `public/`.
- **Números dos superpoderes 2, 3 e 4:** levantados pelo agente dos repos locais e do sistema, com
  fonte em `docs/dados/`; o Darta confere antes de publicar.
- **Projetos:** escolha do agente pelo que for mais pertinente pra vaga de Tech Lead; nada de
  cliente pelo nome.
- **Foto:** a do Darta (webcam, ele escolheu manter assim), em `public/darta.jpg`.
- **Pendente:** formação (o LinkedIn não lista).

## 6. Dados ao vivo

O gráfico de contribuições do GitHub (API pública) e o clima de São Leopoldo (Open-Meteo, sem chave),
buscados no cliente. Falhou: o widget some, nada mais quebra.

## 6.1 Visual (refeito em 2026-10-14, a pedido do Darta: "igual à referência")

Mesmas cores, componentes e layout da referência, com conteúdo, ícones e textos próprios (nenhuma
imagem nem texto dela). Fundo claro (`#fafafa` na mesa, branco nas seções), fonte Bricolage Grotesque.

- **Mesa:** barra de menu fina; widgets de vidro branco arrastáveis (relógio de São Leopoldo,
  calendário, quadro do GitHub, clima de São Leopoldo via Open-Meteo, foto do Darta,
  grade de apps com LinkedIn, GitHub, email, WhatsApp, CV e terminal); pastas azuis na direita.
- **Dock:** ícones de app com degradê (início, superpoderes, em números, sobre mim, agendar
  conversa, contato, terminal), grudado no topo ao rolar.
- **Seções:** Em números (5 cartões com ícone), Stack (faixa que corre sozinha), Superpoderes (pastas
  com aba que se empilham na rolagem, números num post-it amarelo), Projetos (lista), O Terminal
  (pasta que abre o terminal), `sobre-mim.txt` (janela com DEPOIS que abre), rodapé com contatos.
- O quadro do GitHub fica com o azul do site, uma cor só ficando mais forte, legenda "menos … mais".
- Celular: hero em cartão, foto, relógio e calendário, pastas em grade, grade de apps.

## 7. Stack

- Next.js (App Router), `output: 'export'`, TypeScript, Tailwind.
- Framer Motion só em janelas, dock e terminal. Respeita `prefers-reduced-motion`.
- Sem backend.

## 8. Deploy

- Vercel ligada ao repo GitHub próprio (`Romanndemello/portfolio`). Push gera preview; `main` publica.
- Domínio: a decidir. Até lá `*.vercel.app`.

## 9. Testes

- **Unidade (Vitest):** interpretador do terminal (cada comando, Tab, histórico, comando inválido,
  aliases PT/EN); paridade de conteúdo (PT e EN com as mesmas chaves, nenhum valor vazio).
- **Ponta a ponta (Playwright):** página carrega em `/` e `/en`; terminal abre e responde a `help`;
  layout de 375px sem rolagem horizontal; troca de idioma funciona.
- **Lighthouse:** performance e acessibilidade ≥ 90 em mobile.

## 10. Fora da v1

Blog, admin, formulário de contato com backend, analytics além do da Vercel.
