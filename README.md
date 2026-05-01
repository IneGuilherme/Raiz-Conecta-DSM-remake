# Projeto Integrador: Raiz Conecta

> Solução de Software end-to-end para conectar mercados a produtores rurais de forma direta,  e otimizando a venda de hortifruti.

---

## Visão Geral

Este projeto tem como objetivo desenvolver uma solução completa de software, abrangendo todo o ciclo de vida de desenvolvimento: desde o levantamento de requisitos até a implementação, testes e disponibilização da aplicação.

A solução foi projetada para resolver um problema real de negócio na cadeia de suprimentos de alimentos, utilizando boas práticas de engenharia de software, arquitetura escalável de microsserviços e tecnologias modernas de desenvolvimento.

---

## Problema de Negócio

Atualmente, a cadeia de distribuição de alimentos frescos sofre com ineficiências que prejudicam ambas as pontas do comércio.

- **Qual é o contexto?** Mercados locais enfrentam dificuldades para encontrar fornecedores confiáveis e com preços competitivos, enquanto produtores rurais dependem de intermediários para escoar sua produção.

- **Quem é impactado?** Pequenos e médios produtores rurais, que têm sua margem de lucro reduzida, e pequenos e médios mercados/hortifrutis, que arcam com custos elevados de aquisição.

- **Qual processo ou necessidade precisa ser atendida?** A necessidade de um canal direto de comunicação e vendas que facilite o escoamento da produção, reduza o desperdício de alimentos e garanta produtos frescos ao consumidor final.

---

## Solução Proposta

O **Raiz Conecta** é uma plataforma que atua como a ponte digital entre quem planta e quem vende para o consumidor final.

- **Tipo de sistema:** Plataforma Web B2B (Business-to-Business)

- **Principais funcionalidades:** Catálogo inteligente de produtos, carrinho de cotações, gestão de pedidos fracionados, painel administrativo para moderação e sistema de avaliações de entrega.

- **Tecnologias e arquitetura adotadas:** Aplicação Fullstack com Next.js conectada a um banco de dados relacional em nuvem (PostgreSQL via Neon), e uma arquitetura baseada em microsserviço isolado em Node.js/Express para envio de notificações por e-mail.

- **Diferenciais da solução:** Esteira de validação de usuários (segurança contra fraudes via aprovação manual do Admin) e arquitetura distribuída, garantindo que o sistema principal não perca performance durante o disparo de e-mails.

---

## Arquitetura da Solução

O projeto está dividido em duas frentes de execução (Monorepo), permitindo separação clara de responsabilidades:

**Fluxo Principal (Web):**
```
Usuário (Frontend Next.js) → Rotas de API (Next.js) → Prisma ORM → Banco de Dados (PostgreSQL / Neon)
```

**Fluxo de Notificações (Microsserviço):**
```
Administrador aprova usuário → API Principal → Microsserviço (Express.js) → Nodemailer → Mailtrap
```

---

## Documentação do Projeto

- **Confluence (Base de Conhecimento):** [Acessar Workspace](https://raizconectado.atlassian.net/jira/projects?page=1&sortKey=name&sortOrder=ASC&types=software%2Cbusiness)

- **Jira (Gestão Ágil / Roadmap):** [Acessar Timeline](https://raizconectado.atlassian.net/?continue=https%3A%2F%2Fraizconectado.atlassian.net%2Fwelcome%2Fsoftware%3FprojectId%3D10000&atlOrigin=eyJpIjoiYWM4NjljZDJiNmQ5NGRkZWIyNDI4NzFkZmRlOTNkMzkiLCJwIjoiamlyYS1zb2Z0d2FyZSJ9)

- **Documento de Requisitos:** Disponível na raiz do repositório (`Doc Projeto Integrador - Raiz Conecta.docx`)

---

## Sprints

| Nº Sprint | Objetivo | Data Início | Data Término |
| :---: | :--- | :---: | :---: |
| **Sprint 1** | Autenticação, cadastro de usuários e modelagem do banco de dados | - | - |
| **Sprint 2** | Painel do Produtor, Catálogo e gestão de produtos | - | - |
| **Sprint 3** | Vitrine B2B, Carrinho Inteligente e Checkout (Mercado) | - | - |
| **Sprint 4** | Microsserviço de E-mail, Validação Admin e Landing Page | - | 05/05/2026 |

> Datas precisas e status de cada task disponíveis diretamente no [painel do Jira](https://raizconectado.atlassian.net).

---

## Tecnologias Utilizadas

- **Linguagem:** TypeScript / JavaScript
- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express.js 5, Prisma ORM
- **Banco de Dados:** PostgreSQL (hospedagem serverless via [Neon](https://neon.tech))
- **Notificações:** Nodemailer + Mailtrap
- **Versionamento:** Git / GitHub
- **Gestão:** Jira / Confluence

---

## Funcionalidades

- **Onboarding e Validação:** Cadastro com autocompletar de endereço via ViaCEP e aprovação manual obrigatória pelo Administrador antes do acesso à plataforma.
- **Painel do Produtor Rural:** Interface para o agricultor visualizar demandas da região, ofertar produtos de forma fracionada e controlar o estoque de pedidos.
- **Painel do Mercado (Comprador):** Vitrine digital com busca e filtros, onde o lojista monta seu carrinho e dispara cotações para produtores parceiros.
- **Sistema de Avaliação Logística:** Após o recebimento, o mercado avalia a qualidade da entrega do produtor de 1 a 5 estrelas.
- **Central de Administração:** Painel exclusivo para moderar a plataforma, visualizar pedidos globais e gerenciar status de usuários.

---

## Resultados Esperados

- **Resolução do problema de negócio:** Democratização do acesso a mercados para o pequeno produtor e vice-versa, eliminando intermediários.

- **Melhoria na eficiência do processo:** Redução do desperdício de alimentos por meio de uma logística direta entre produtor e mercado.

- **Fomento econômico sustentável:** Geração de renda justa para produtores rurais, contribuindo para os Objetivos de Desenvolvimento Sustentável (ODS).

- **Experiência do usuário aprimorada:** Interface SaaS minimalista projetada para usuários com pouca vivência tecnológica.

- **Base escalável para evolução futura:** Arquitetura preparada para a futura inserção de entregadores terceirizados no ecossistema.

---

## Como Executar o Projeto

O projeto possui dois ambientes que devem ser iniciados simultaneamente.

### Pré-requisitos

- Node.js (versão 18+)
- Gerenciador de pacotes npm
- Arquivo `.env` configurado em cada pasta com as credenciais do Neon (Prisma) e do Mailtrap

### Instalação e Execução

**Passo 1 — Clonar o repositório**

```bash
git clone [URL_DO_REPOSITORIO]
cd raiz-conecta
```

**Passo 2 — Rodar a Aplicação Principal (Next.js)**

```bash
cd app-principal
npm install
npx prisma generate
npm run dev
# Disponível em http://localhost:3000
```

**Passo 3 — Rodar o Microsserviço de E-mail (Express.js)**

```bash
cd microservico
npm install
node server.js
# Disponível em http://localhost:3001
```
