import { NextResponse } from "next/server";

// ROTA GET: O nosso "Garçom" que serve o catálogo para o mercado
export async function GET() {
  // Simulando a busca de um banco de dados
  const produtos = [
    {
      id: 1,
      nome: "Maçã Gala",
      icone: "🍎",
      unidadePadrao: "Caixas",
      categoria: "Frutas",
    },
    {
      id: 2,
      nome: "Laranja Pera",
      icone: "🍊",
      unidadePadrao: "Caixas",
      categoria: "Frutas",
    },
    {
      id: 3,
      nome: "Banana Prata",
      icone: "🍌",
      unidadePadrao: "Cachos",
      categoria: "Frutas",
    },
    {
      id: 4,
      nome: "Alface Crespa",
      icone: "🥬",
      unidadePadrao: "Maços",
      categoria: "Verduras",
    },
    {
      id: 5,
      nome: "Tomate Carmem",
      icone: "🍅",
      unidadePadrao: "Caixas",
      categoria: "Legumes",
    },
    {
      id: 6,
      nome: "Cenoura",
      icone: "🥕",
      unidadePadrao: "Kg",
      categoria: "Legumes",
    },
    {
      id: 7,
      nome: "Brócolis",
      icone: "🥦",
      unidadePadrao: "Maços",
      categoria: "Verduras",
    },
    {
      id: 8,
      nome: "Melancia",
      icone: "🍉",
      unidadePadrao: "Unidades",
      categoria: "Frutas",
    },
  ];

  return NextResponse.json(produtos);
}
