# 🌿 Raiz Conecta

O projeto tem como objetivo desenvolver um aplicativo web inovador que conecte pequenos e médios produtores rurais a mercados de pequeno e médio porte. A plataforma facilita o acesso a produtos frescos, de qualidade e com procedência garantida, aproximando quem produz de quem comercializa. 

Sistema de intermediação entre produtores rurais e mercados locais. O projeto utiliza uma arquitetura moderna com Next.js e um microsserviço dedicado para disparos de e-mail.

## 🏗️ Estrutura do Projeto

- **/app-principal**: Sistema web principal (Next.js + Tailwind + Prisma ORM + PostGreeSQL).
- **/microservico**: Serviço Node.js para envio de e-mails via Mailtrap.

## 📄 Documentação do Projeto

**Confluence:**
https://pidsm.atlassian.net/wiki/spaces/GGD/pages/131263/PI+DSM+-+RAIZ+CONECTA?atlOrigin=eyJpIjoiYmRjNDIwZjkzZWYzNGQ5M2ExMzI5YzUxYTlkZGI2NDEiLCJwIjoiYyJ9

**Jira:**
https://raizconectado.atlassian.net/?continue=https%3A%2F%2Fraizconectado.atlassian.net%2Fwelcome%2Fsoftware%3FprojectId%3D10000&atlOrigin=eyJpIjoiYWM4NjljZDJiNmQ5NGRkZWIyNDI4NzFkZmRlOTNkMzkiLCJwIjoiamlyYS1zb2Z0d2FyZSJ9


## 🚀 Como Rodar o Projeto (Ambiente Universitário)

> **Nota:** Utilizamos o PostGreeSQL, com o Neon como hospedagem do banco de dados atrvéz da api fornecida gratuitamente.

### 1. Clonar e Instalar as Dependências
Abra o terminal na pasta `raiz-conecta` e instale as dependências dos dois projetos:
```bash

cd app-principal
npm install
npx prisma generate

cd ../microservico
npm install