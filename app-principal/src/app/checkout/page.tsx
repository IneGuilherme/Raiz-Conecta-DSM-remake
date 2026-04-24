"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldCheck, MapPin, Search, Plus, Minus, ShoppingCart, Leaf } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Produtos Mockados para a Vitrine (Até criarmos o banco de produtos da plataforma)
const CATALOGO = [
  { id: 1, nome: "Maçã Fuji (Caixa 18kg)", precoEstimado: 85.00, img: "🍎" },
  { id: 2, nome: "Laranja Pera (Saco 20kg)", precoEstimado: 45.00, img: "🍊" },
  { id: 3, nome: "Alface Crespa (Caixa 12 Maços)", precoEstimado: 24.00, img: "🥬" },
  { id: 4, nome: "Tomate Carmem (Caixa 20kg)", precoEstimado: 60.00, img: "🍅" },
];

export default function CheckoutMercado() {
  const router = useRouter();
  const [mercado, setMercado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState<any[]>([]);

  useEffect(() => {
    async function carregar() {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(`/api/mercado/perfil?email=${email}`);
        if (res.ok) {
          const dados = await res.json();
          setMercado(dados);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [router]);

  const adicionarAoCarrinho = (produto: any) => {
    const existe = carrinho.find((item) => item.id === produto.id);
    if (existe) {
      setCarrinho(carrinho.map((item) => item.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item));
    } else {
      setCarrinho([...carrinho, { ...produto, qtd: 1 }]);
    }
  };

  const removerDoCarrinho = (id: number) => {
    const existe = carrinho.find((item) => item.id === id);
    if (existe.qtd === 1) {
      setCarrinho(carrinho.filter((item) => item.id !== id));
    } else {
      setCarrinho(carrinho.map((item) => item.id === id ? { ...item, qtd: item.qtd - 1 } : item));
    }
  };

  const totalEstimado = carrinho.reduce((acc, item) => acc + (item.precoEstimado * item.qtd), 0);

  const dispararPedido = async () => {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    // Aqui conectaremos com a API de Demanda que fizemos no banco!
    alert("Demanda disparada com sucesso para os produtores da região!");
    setCarrinho([]);
  };

  if (loading) return <div className="p-20 text-center text-green-700 font-bold">Carregando portal do comprador...</div>;
  if (!mercado) return <div className="p-20 text-center">Acesso Negado.</div>;

  // TRAVA DE SEGURANÇA!
  if (mercado.status === "EM_ANALISE") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="p-12 text-center shadow-lg max-w-lg border-t-4 border-amber-500">
          <Clock size={64} className="mx-auto text-amber-500 mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastro em Análise</h2>
          <p className="text-gray-600">Recebemos sua documentação! Nossos administradores estão verificando seus dados para garantir a segurança da plataforma. Volte em breve.</p>
        </Card>
      </div>
    );
  }

  // TELA DE VITRINE E CHECKOUT (Aprovado)
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* LADO ESQUERDO: Catálogo e Dados (Estilo Codante) */}
        <div className="w-full lg:w-2/3 space-y-6">

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <Leaf className="text-green-600" /> Raiz Conecta
            </h1>
          </div>

          {/* DADOS DE ENTREGA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={20} className="text-green-600" /> Local de Entrega</h2>
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 border border-gray-100">
              <p className="font-bold text-base mb-1">{mercado.nomeFantasia || mercado.razaoSocial}</p>
              <p>{mercado.rua}, {mercado.numero} - {mercado.bairro}</p>
              <p>{mercado.cidade} / {mercado.estado} - CEP: {mercado.cep}</p>
            </div>
          </div>

          {/* CATÁLOGO RÁPIDO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Search size={20} className="text-blue-600" /> Catálogo de Produtos</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATALOGO.map(prod => (
                <div key={prod.id} className="border border-gray-200 rounded-xl p-4 text-center hover:border-green-400 hover:shadow-md transition-all cursor-pointer" onClick={() => adicionarAoCarrinho(prod)}>
                  <div className="text-4xl mb-3">{prod.img}</div>
                  <h3 className="font-semibold text-sm text-gray-800 h-10">{prod.nome}</h3>
                  <p className="text-xs text-gray-500 mt-2">Est. R$ {prod.precoEstimado.toFixed(2)}</p>
                  <Button variant="outline" className="w-full mt-3 h-8 text-xs border-green-200 text-green-700 hover:bg-green-50">Adicionar</Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LADO DIREITO: Resumo do Pedido (Checkout) */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ShoppingCart className="text-green-600" /> Sua Demanda
            </h2>

            {carrinho.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
                <p>Adicione produtos para iniciar uma cotação.</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {carrinho.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.img}</span>
                      <div>
                        <p className="font-bold text-sm text-gray-800 truncate w-32">{item.nome}</p>
                        <p className="text-xs text-gray-500">R$ {item.precoEstimado.toFixed(2)} / un</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                      <button onClick={() => removerDoCarrinho(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"><Minus size={14} /></button>
                      <span className="text-sm font-bold w-4 text-center">{item.qtd}</span>
                      <button onClick={() => adicionarAoCarrinho(item)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center text-gray-600 mb-2">
                <span>Taxa da Plataforma</span>
                <span>Grátis</span>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 mt-4">
                <span>Total Estimado</span>
                <span>R$ {totalEstimado.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">O preço final será definido pelos produtores nas ofertas.</p>
            </div>

            <Button onClick={dispararPedido} disabled={carrinho.length === 0} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 flex items-center justify-center gap-2">
              <ShieldCheck size={20} /> Disparar para Produtores
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}