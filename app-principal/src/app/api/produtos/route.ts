import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";

// LER PRODUTOS
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(produtos);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

// CRIAR NOVO PRODUTO COM IMAGEM
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const nome = formData.get("nome") as string;
    const tipo = formData.get("tipo") as string;
    const preco = formData.get("preco") as string;
    const unidadePadrao = formData.get("unidadePadrao") as string;
    const file = formData.get("file") as File;

    let imagemUrl = "";

    // Se o Admin enviou uma foto
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const nomeArquivo = `prod_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const caminhoDestino = path.join(process.cwd(), "public/uploads/produtos", nomeArquivo);

      await writeFile(caminhoDestino, buffer);
      imagemUrl = `/uploads/produtos/${nomeArquivo}`;
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        tipo,
        preco: parseFloat(preco),
        imagemUrl,
        unidadePadrao,
        status: "ATIVO"
      }
    });

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao cadastrar o produto" }, { status: 500 });
  }
}

// EXCLUIR PRODUTO E APAGAR A FOTO DO HD
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID não informado" }, { status: 400 });

    // 1. Busca o produto no banco primeiro para saber se ele tem foto
    const produto = await prisma.produto.findUnique({
      where: { cdProduto: Number(id) }
    });

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // 2. Se o produto tiver uma imagem, vamos apagá-la do HD físico do servidor
    if (produto.imagemUrl) {
      // O caminho no banco está como "/uploads/produtos/foto.png"
      // Nós precisamos avisar ao Node que isso fica dentro da pasta "public"
      const caminhoArquivoFisico = path.join(process.cwd(), "public", produto.imagemUrl);

      try {
        await unlink(caminhoArquivoFisico); // Aqui é onde o Node apaga o arquivo!
        console.log(`Foto do produto apagada do disco: ${produto.imagemUrl}`);
      } catch (err) {
        // Se a foto já não existir no disco, a gente apenas ignora e segue a vida
        console.log("Aviso: Foto não encontrada no disco para exclusão.");
      }
    }

    // 3. Finalmente, apaga o registro do banco de dados PostgreSQL
    await prisma.produto.delete({
      where: { cdProduto: Number(id) }
    });

    return NextResponse.json({ message: "Produto e foto apagados com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao apagar. O produto já pode estar atrelado a um produtor." }, { status: 500 });
  }
}