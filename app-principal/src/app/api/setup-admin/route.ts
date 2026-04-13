import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        // 1. Verifica se já existe algum admin no banco para não duplicar
        const adminExiste = await prisma.acesso.findFirst({
            where: { tipoUser: "admin" }
        });

        if (adminExiste) {
            return NextResponse.json({ message: "O Admin Mestre já existe no banco de dados." });
        }

        // 2. Criptografa a senha padrão do admin
        const hashSenha = await bcrypt.hash("admin123", 10);
        const acessoId = Math.floor(Math.random() * 1000000);

        // 3. Injeta o Admin direto na tabela de Acesso
        await prisma.acesso.create({
            data: {
                id: acessoId,
                login: "admin@raizconecta.com",
                hash: hashSenha,
                tipoUser: "admin",
                status: "A", // "A"tivo
            }
        });

        return NextResponse.json({
            message: "Admin Mestre criado com sucesso!",
            credenciais: {
                login: "admin@raizconecta.com",
                senha: "admin123"
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao criar admin." }, { status: 500 });
    }
}