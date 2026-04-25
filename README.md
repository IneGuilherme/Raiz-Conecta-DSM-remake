# 🌿 Raiz Conecta

Sistema de intermediação entre produtores rurais e mercados locais. O projeto utiliza uma arquitetura moderna com Next.js e um microsserviço dedicado para disparos de e-mail.

## 🏗️ Estrutura do Projeto

- **/app-principal**: Sistema web principal (Next.js + Tailwind + Prisma ORM + SQLite).
- **/microservico**: Serviço Node.js para envio de e-mails via Mailtrap.

## 🚀 Como Rodar o Projeto (Ambiente Universitário)

> **Nota:** O banco de dados SQLite (`dev.db`) foi mantido no repositório para facilitar o teste imediato em computadores da universidade.

### 1. Clonar e Instalar as Dependências
Abra o terminal na pasta `raiz-conecta` e instale as dependências dos dois projetos:
```bash

cd app-principal
npm install
npx prisma generate

cd ../microservico
npm install