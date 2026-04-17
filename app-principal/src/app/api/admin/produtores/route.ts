import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ROTA GET: Busca todos os produtores que estão aguardando análise (Brotos)
export async function GET() {
    try {
        const pendentes = await prisma.vendedor.findMany({
            where: { status: "A_ANALISE" },
            orderBy: { nomeFantasia: 'asc' } // Organiza em ordem alfabética
        });
        return NextResponse.json(pendentes);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar produtores" }, { status: 500 });
    }
}

// ROTA PATCH: Atualiza o status do produtor (Aprova ou Rejeita)
export async function PATCH(req: Request) {
    try {
        const { email, acao } = await req.json();

        if (!email || !acao) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

        if (acao === "aprovar") {
            await prisma.vendedor.updateMany({
                where: { email },
                data: { status: "A" }
            });

            // 🚀 INTEGRAÇÃO COM MICROSSERVIÇO DE E-MAIL (APROVAÇÃO)
            try {
                await fetch("http://localhost:3001/api/email/aprovacao", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, status: "aprovado" })
                });
            } catch (e) { console.log("Aviso: Microsserviço de e-mail offline."); }

            return NextResponse.json({ message: "Produtor aprovado!" });
        }

        if (acao === "rejeitar") {
            // Muda o status para REJEITADO para o front-end saber
            await prisma.vendedor.updateMany({
                where: { email },
                data: { status: "REJEITADO", urlDocumento: null }
            });

            // 🚀 INTEGRAÇÃO COM MICROSSERVIÇO DE E-MAIL (REJEIÇÃO)
            try {
                await fetch("http://localhost:3001/api/email/rejeicao", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, status: "rejeitado" })
                });
            } catch (e) { console.log("Aviso: Microsserviço de e-mail offline."); }

            return NextResponse.json({ message: "Produtor rejeitado." });
        }

        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}