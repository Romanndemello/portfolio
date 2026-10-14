# Portfólio · D'Artagnan Romann

Site pessoal bilíngue (PT em `/`, EN em `/en/`) com metáfora de desktop, terminal funcional e números reais.
Next.js com export estático, sem backend.

## Comandos

| comando | o que faz |
|---|---|
| `npm run dev` | desenvolvimento em http://localhost:3000 |
| `npm test` | testes de unidade (Vitest) |
| `npm run e2e` | build + testes ponta a ponta (Playwright, desktop e celular) |
| `npm run cv` | regenera `public/cv-pt.pdf` e `public/cv-en.pdf` a partir do conteúdo |
| `npm run build` | gera o site estático em `out/` |

## Onde editar

- **Texto:** `src/content/pt.ts` e `src/content/en.ts`. Os dois precisam ter as mesmas chaves (o teste confere).
- **Números:** todo número tem fonte em `docs/dados/`. Número novo sem fonte não entra.
- **Comandos do terminal:** `src/terminal/interpreter.ts`.

Mudou texto de experiência ou stack? Rode `npm run cv` pra atualizar os PDFs.

## Documentos

- Spec: `docs/specs/2026-10-14-portfolio-design.md`
- Plano: `docs/plans/2026-10-14-portfolio.md`
