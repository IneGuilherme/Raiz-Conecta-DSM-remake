import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        // 1. Pega os dados que o Front-end enviou
        const body = await req.json();
        const { tipoUsuario, nome, documento, telefone, email, senha } = body;

        // 2. Verifica se o e-mail já existe na tabela de Acesso
        const usuarioExistente = await prisma.acesso.findFirst({
            where: { login: email }
        });

        if (usuarioExistente) {
            return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 400 });
        }

        // 3. Criptografa a senha
        const hashSenha = await bcrypt.hash(senha, 10);

        // 4. Gera IDs únicos (Como não estamos usando AUTO_INCREMENT no SQLite, geramos manualmente)
        const novoId = Math.floor(Math.random() * 1000000);
        const acessoId = Math.floor(Math.random() * 1000000);

        // 5. Salva no Banco de Dados
        if (tipoUsuario === "produtor") {
            await prisma.vendedor.create({
                data: {
                    cdVendedor: novoId,
                    nomeFantasia: nome,
                    documento: documento,
                    telefone: telefone,
                    email: email,
                    status: "P", // "P" de Pendente (O Admin aprova depois)
                    Acessos: {
                        create: {
                            id: acessoId,
                            login: email,
                            hash: hashSenha,
                            tipoUser: "produtor",
                            status: "P"
                        }
                    }
                }
            });
        } else {
            await prisma.cliente.create({
                data: {
                    cdCliente: novoId,
                    nomeFantasia: nome,
                    documento: documento,
                    telefone: telefone,
                    email: email,
                    status: "A", // O Mercado já nasce "A"tivo
                    Acessos: {
                        create: {
                            id: acessoId,
                            login: email,
                            hash: hashSenha,
                            tipoUser: "mercado",
                            status: "A"
                        }
                    }
                }
            });
        }

        // ------------------------------------------------------------------
        // 6. DISPARO DO E-MAIL VIA MICROSSERVIÇO (A Ponte)
        // ------------------------------------------------------------------
        try {
            // O App Principal (porta 3000) faz uma requisição HTTP para o Microsserviço (porta 3001)
            await fetch("http://localhost:3001/api/email/boas-vindas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    nome: nome,
                    tipoUsuario: tipoUsuario
                })
            });
            console.log("Aviso de disparo de e-mail enviado ao Microsserviço!");
        } catch (err) {
            // Usamos try/catch para que, se o servidor de e-mail estiver desligado, 
            // o cadastro do usuário NÃO seja cancelado. Ele salva no banco do mesmo jeito!
            console.error("Falha ao comunicar com o microsserviço de e-mail:", err);
        }
        // ------------------------------------------------------------------

        return NextResponse.json({ message: "Cadastro realizado com sucesso!" }, { status: 201 });

    } catch (error) {
        console.error("Erro na API de Cadastro:", error);
        return NextResponse.json({ error: "Erro interno no servidor ao tentar cadastrar." }, { status: 500 });
    }
}