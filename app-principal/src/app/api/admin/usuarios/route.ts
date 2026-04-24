import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ROTA GET: Busca todos que estão aguardando análise (Produtores e Mercados)
export async function GET() {
    try {
        const produtores = await prisma.vendedor.findMany({
            where: { status: "EM_ANALISE" }, orderBy: { nomeFantasia: 'asc' }
        });
        const mercados = await prisma.cliente.findMany({
            where: { status: "EM_ANALISE" }, orderBy: { nomeFantasia: 'asc' }
        });
        // Busca os aprovados para o painel de ativos
        const ativosProdutores = await prisma.vendedor.findMany({
            where: { status: "APROVADO" }, orderBy: { nomeFantasia: 'asc' }
        });
        const ativosMercados = await prisma.cliente.findMany({
            where: { status: "APROVADO" }, orderBy: { nomeFantasia: 'asc' }
        });

        return NextResponse.json({
            produtores, mercados,
            ativos: [...ativosProdutores.map(p => ({ ...p, tipo: 'Produtor' })), ...ativosMercados.map(m => ({ ...m, tipo: 'Mercado' }))]
        });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }
}

// ROTA PATCH: Atualiza o status do usuário (Aprova ou Rejeita)
export async function PATCH(req: Request) {
    try {
        const { email, tipo, acao } = await req.json();

        if (!email || !tipo || !acao) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const novoStatus = acao === "aprovar" ? "APROVADO" : "REJEITADO";

        // 1. Atualiza a Tabela Principal (Produtor ou Mercado)
        if (tipo === "produtor") {
            await prisma.vendedor.update({
                where: { email },
                data: acao === "rejeitar" ? { status: novoStatus, urlDocumento: null } : { status: novoStatus }
            });
        } else if (tipo === "mercado") {
            await prisma.cliente.update({
                where: { email },
                data: { status: novoStatus }
            });
        } else {
            return NextResponse.json({ error: "Tipo de usuário inválido" }, { status: 400 });
        }

        // 2. Atualiza a Tabela de ACESSO (Para o login liberar ou bloquear)
        await prisma.acesso.updateMany({
            where: { login: email },
            data: { status: novoStatus }
        });

        // 3. INTEGRAÇÃO COM MICROSSERVIÇO DE E-MAIL
        if (acao === "aprovar") {
            try {
                await fetch("http://localhost:3001/api/email/aprovacao", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, status: "aprovado" })
                });
            } catch (e) { console.log("Aviso: Microsserviço de e-mail offline."); }

            return NextResponse.json({ message: "Usuário aprovado com sucesso!" });
        }

        if (acao === "rejeitar") {
            try {
                await fetch("http://localhost:3001/api/email/rejeicao", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, status: "rejeitado" })
                });
            } catch (e) { console.log("Aviso: Microsserviço de e-mail offline."); }

            return NextResponse.json({ message: "Usuário rejeitado." });
        }

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}