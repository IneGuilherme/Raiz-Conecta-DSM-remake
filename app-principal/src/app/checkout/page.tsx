"use client";

import { useState, useEffect } from "react";
import {
  Store,
  PlusCircle,
  ShoppingBasket,
  Clock,
  CheckCircle,
  Trash2,
  Send,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Interfaces para o TypeScript
interface ProdutoCatalogo {
  id: number;
  nome: string;
  icone: string;
  unidadePadrao: string;
  categoria: string;
}

interface ItemCarrinho {
  idTemp: string;
  produto: string;
  quantidade: number;
  unidade: string;
}

interface Oferta {
  quantidade: number;
}

interface Demanda {
  id: string;
  produto: string;
  quantidade: number;
  unidade: string;
  status: string;
  ofertas: Oferta[];
}

export default function MercadoCheckoutPage() {
  const [emailMercado, setEmailMercado] = useState<string | null>(null);
  const [catalogoApi, setCatalogoApi] = useState<ProdutoCatalogo[]>([]);
  const [demandasAtivas, setDemandasAtivas] = useState<Demanda[]>([]);

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoCatalogo | null>(null);
  const [quantidade, setQuantidade] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setEmailMercado(email);
      buscarMinhasDemandas(email);
    }
    buscarProdutosNaAPI();
  }, []);

  const buscarProdutosNaAPI = async () => {
    try {
      const res = await fetch(`/api/produtos`);
      const dados = await res.json();
      setCatalogoApi(dados);
    } catch (err) {
      console.error("Erro ao carregar catálogo da API", err);
    }
  };

  const buscarMinhasDemandas = async (email: string) => {
    try {
      const res = await fetch(`/api/mercado/demandas?email=${email}`);
      const dados = await res.json();
      setDemandasAtivas(dados);
    } catch (err) {
      console.error("Erro ao buscar demandas", err);
    }
  };

  const adicionarAoCarrinho = () => {
    if (!quantidade || Number(quantidade) <= 0 || !produtoSelecionado) {
      alert("Insira uma quantidade válida.");
      return;
    }

    const novoItem: ItemCarrinho = {
      idTemp: Math.random().toString(),
      produto: `${produtoSelecionado.icone} ${produtoSelecionado.nome}`,
      quantidade: Number(quantidade),
      unidade: produtoSelecionado.unidadePadrao,
    };

    setCarrinho([...carrinho, novoItem]);
    setProdutoSelecionado(null);
    setQuantidade("");
  };

  const removerDoCarrinho = (idTemp: string) => {
    setCarrinho(carrinho.filter((item) => item.idTemp !== idTemp));
  };

  const dispararPedidoEmMassa = async () => {
    if (carrinho.length === 0) return;

    setCarregando(true);
    try {
      await fetch("/api/mercado/demandas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailMercado: emailMercado,
          itens: carrinho,
        }),
      });

      alert("Lista de pedidos disparada com sucesso para os produtores!");
      setCarrinho([]);
      buscarMinhasDemandas(emailMercado!);
    } catch (err) {
      console.error(err);
      alert("Erro ao disparar a lista.");
    } finally {
      setCarregando(false);
    }
  };

  if (!emailMercado)
    return <p className="p-10 text-center">Carregando portal do mercado...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl text-white shadow-md">
            <Store size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Catálogo de Abastecimento
            </h1>
            <p className="text-gray-600">
              Monte sua lista de necessidades e nós notificamos os produtores
              locais.
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBasket className="text-green-600" /> Produtos Disponíveis
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {catalogoApi.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setProdutoSelecionado(item);
                    setQuantidade("");
                  }}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    produtoSelecionado?.id === item.id
                      ? "border-green-500 bg-green-50 shadow-md transform scale-105"
                      : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{item.icone}</div>
                  <h3 className="font-bold text-sm text-gray-800">
                    {item.nome}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase">
                    {item.categoria}
                  </p>
                </button>
              ))}
            </div>

            {produtoSelecionado && (
              <Card className="mt-8 p-6 bg-green-50 border-green-200 shadow-md animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-sm font-bold text-green-900 block mb-2">
                      Adicionar {produtoSelecionado.icone}{" "}
                      {produtoSelecionado.nome} (em{" "}
                      {produtoSelecionado.unidadePadrao})
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder={`Quantas ${produtoSelecionado.unidadePadrao}?`}
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <Button
                    onClick={adicionarAoCarrinho}
                    className="w-full sm:w-auto bg-green-700 hover:bg-green-800 py-3 h-12"
                  >
                    <PlusCircle size={18} className="mr-2" /> Pôr na Lista
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-blue-200 bg-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                Sua Lista de Pedidos
              </h2>

              {carrinho.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                  Sua lista está vazia. Selecione produtos ao lado.
                </p>
              ) : (
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                  {carrinho.map((item) => (
                    <div
                      key={item.idTemp}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {item.produto}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantidade} {item.unidade}
                        </p>
                      </div>
                      <button
                        onClick={() => removerDoCarrinho(item.idTemp)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={dispararPedidoEmMassa}
                disabled={carrinho.length === 0 || carregando}
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 font-bold shadow-md h-12"
              >
                {carregando ? (
                  "Disparando..."
                ) : (
                  <>
                    <Send size={18} className="mr-2" /> Disparar{" "}
                    {carrinho.length} Pedidos
                  </>
                )}
              </Button>
            </Card>

            <Card className="p-6 bg-gray-50/50 border-gray-200">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock size={16} /> Status das Demandas
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {demandasAtivas.map((demanda) => {
                  const atendida = demanda.ofertas.reduce(
                    (acc: number, ofr: Oferta) => acc + ofr.quantidade,
                    0,
                  );
                  const porcentagem = Math.min(
                    (atendida / demanda.quantidade) * 100,
                    100,
                  );

                  return (
                    <div
                      key={demanda.id}
                      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-gray-800 text-sm">
                          {demanda.produto}
                        </h4>
                        <span className="text-xs font-bold text-gray-500">
                          {demanda.quantidade} {demanda.unidade}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full ${porcentagem === 100 ? "bg-green-500" : "bg-blue-500"}`}
                          style={{ width: `${porcentagem}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                        <span>{atendida} Oferecidos</span>
                        {porcentagem === 100 && (
                          <span className="text-green-600">
                            <CheckCircle size={10} className="inline mr-1" />{" "}
                            Completo
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
