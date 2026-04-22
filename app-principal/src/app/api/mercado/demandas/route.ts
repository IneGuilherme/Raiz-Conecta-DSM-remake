import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Agora esperamos um email e uma LISTA de itens
    const { emailMercado, itens } = await req.json();

    if (!emailMercado || !itens || itens.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio ou dados inválidos" },
        { status: 400 },
      );
    }

    // Prepara os dados para o Prisma (colocando o email do mercado e o status em todos)
    interface ItemRecebido {
      produto: string;
      quantidade: number | string;
      unidade: string;
    }

    const dadosParaSalvar = itens.map((item: ItemRecebido) => ({
      produto: item.produto,
      quantidade: Number(item.quantidade),
      unidade: item.unidade,
      emailMercado: emailMercado,
      status: "ABERTA",
    }));

    // O comando "createMany" salva dezenas de pedidos no banco em 1 milissegundo!
    await prisma.demanda.createMany({
      data: dadosParaSalvar,
    });

    return NextResponse.json(
      { message: "Demandas disparadas com sucesso!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao salvar demanda:", error);
    return NextResponse.json(
      { error: "Erro ao criar demanda" },
      { status: 500 },
    );
  }
}

// ... (MANTENHA A ROTA GET QUE JÁ EXISTE AQUI) ...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  try {
    const demandas = await prisma.demanda.findMany({
      where: email ? { emailMercado: email } : {},
      include: { ofertas: true },
      orderBy: { criadoEm: "desc" },
    });
    return NextResponse.json(demandas);
  } catch (error) {
    console.error("Erro ao buscar demanda:", error); // Adicionado console.error
    return NextResponse.json(
      { error: "Erro ao buscar demandas" },
      { status: 500 },
    );
  }
}
