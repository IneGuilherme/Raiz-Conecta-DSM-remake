"use client";

import { useEffect, useState } from "react";
import {
  UploadCloud,
  Clock,
  CheckCircle,
  ShieldCheck,
  XCircle,
  PackageOpen,
  Handshake,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Interfaces para organizar as informações
interface Oferta {
  quantidade: number;
}
interface Demanda {
  id: string;
  produto: string;
  quantidade: number;
  unidade: string;
  status: string;
  emailMercado: string;
  ofertas: Oferta[];
}

interface PerfilProdutor {
  email: string;
  nomeFantasia: string;
  status: string;
}

export default function PainelProdutor() {
  // Estados colocados corretamente dentro da função
  const [produtor, setProdutor] = useState<PerfilProdutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [arquivo, setArquivo] = useState<File | null>(null);

  const [demandasAbertas, setDemandasAbertas] = useState<Demanda[]>([]);
  const [inputsOferta, setInputsOferta] = useState<{ [key: string]: string }>(
    {},
  );
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const emailLogado = localStorage.getItem("userEmail");
      if (emailLogado) {
        try {
          const resPerfil = await fetch(
            `/api/vendedor/perfil?email=${emailLogado}`,
          );
          const dadosPerfil = await resPerfil.json();
          setProdutor(dadosPerfil);

          if (dadosPerfil.status === "A") {
            buscarOportunidades();
          }
        } catch (err) {
          console.error("Erro ao buscar perfil", err);
        }
      }
      setLoading(false);
    }
    carregarDados();
  }, []);

  const buscarOportunidades = async () => {
    try {
      const res = await fetch(`/api/mercado/demandas`);
      const todasDemandas = await res.json();
      setDemandasAbertas(
        todasDemandas.filter((d: Demanda) => d.status === "ABERTA"),
      );
    } catch (err) {
      console.error("Erro ao buscar demandas", err);
    }
  };

  const enviarParaAnalise = async () => {
    if (!arquivo)
      return alert("Por favor, selecione a foto do documento primeiro.");
    setLoading(true);
    const emailLogado = localStorage.getItem("userEmail");
    const formData = new FormData();
    formData.append("email", emailLogado!);
    formData.append("file", arquivo);

    try {
      await fetch("/api/vendedor/perfil", { method: "POST", body: formData });
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar arquivo.");
      setLoading(false);
    }
  };

  const enviarOferta = async (demanda: Demanda) => {
    const quantidade = inputsOferta[demanda.id];

    if (!quantidade || Number(quantidade) <= 0 || !produtor) {
      return alert("Insira uma quantidade válida para ofertar.");
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/produtor/ofertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demandaId: demanda.id,
          quantidade: quantidade,
          emailProdutor: produtor.email,
        }),
      });

      const dados = await res.json();
      if (!res.ok) {
        alert(dados.error);
      } else {
        alert("Negócio fechado! Sua oferta foi registrada.");
        setInputsOferta({ ...inputsOferta, [demanda.id]: "" });
        buscarOportunidades();
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao enviar oferta.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading)
    return (
      <p className="p-10 text-center font-bold text-green-700">
        Carregando portal...
      </p>
    );
  if (!produtor)
    return (
      <p className="p-10 text-center">
        Usuário não encontrado. Faça login novamente.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-900 uppercase">
              Olá, {produtor.nomeFantasia || "Produtor"}
            </h1>
            <p className="text-gray-600 font-light mt-1">
              Nível de Acesso:
              <span className="font-bold ml-2 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm">
                {produtor.status === "P"
                  ? "Semente 🌱"
                  : produtor.status === "A_ANALISE"
                    ? "Broto 🌿"
                    : "Raiz 🌳"}
              </span>
            </p>
          </div>
        </header>

        {produtor.status === "P" && (
          <Card className="p-8 border-orange-200 bg-orange-50/20">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="text-orange-500" /> Nível Semente:
              Primeiros Passos
            </h2>
            <p className="text-gray-600 my-4">
              Seu acesso é limitado. Envie uma foto do seu documento para
              liberar as vendas.
            </p>
            <div
              className={`border-2 border-dashed p-8 rounded-xl text-center transition-colors ${arquivo ? "border-green-500 bg-green-50" : "border-gray-300 bg-white hover:bg-gray-50"}`}
            >
              <input
                type="file"
                className="hidden"
                id="fileDoc"
                accept="image/*,.pdf"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              />
              <label htmlFor="fileDoc" className="cursor-pointer block">
                <UploadCloud
                  className={`mx-auto w-12 h-12 mb-3 ${arquivo ? "text-green-500" : "text-gray-400"}`}
                />
                <p className="text-sm font-bold text-gray-700">
                  {arquivo
                    ? `Arquivo selecionado: ${arquivo.name}`
                    : "Clique para anexar documento"}
                </p>
              </label>
            </div>
            <Button
              onClick={enviarParaAnalise}
              className="mt-6 w-full bg-green-700 py-6 text-lg"
            >
              Enviar Documento
            </Button>
          </Card>
        )}

        {produtor.status === "A_ANALISE" && (
          <Card className="p-12 text-center shadow-md border-t-4 border-t-amber-500">
            <Clock size={56} className="mx-auto text-amber-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800">
              Documentação em Auditoria
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Você enviou os documentos e agora é um Broto! 🌱
            </p>
          </Card>
        )}

        {produtor.status === "REJEITADO" && (
          <Card className="p-8 border-red-300 bg-red-50">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="text-red-600 w-8 h-8" />
              <h2 className="text-2xl font-bold text-red-800">
                Documentação Recusada
              </h2>
            </div>
            <p className="text-red-700 mb-6 font-medium">
              Infelizmente não conseguimos validar o documento enviado.
            </p>
            <div className="border-2 border-dashed border-red-300 p-8 rounded-xl text-center bg-white">
              <input
                type="file"
                className="hidden"
                id="fileDocRejeitado"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="fileDocRejeitado"
                className="cursor-pointer block"
              >
                <p className="text-sm font-bold text-red-800">
                  {arquivo
                    ? `Novo arquivo: ${arquivo.name}`
                    : "Clique para anexar um NOVO documento"}
                </p>
              </label>
            </div>
            <Button
              onClick={enviarParaAnalise}
              className="mt-6 w-full bg-red-600 py-6 text-lg"
            >
              Reenviar para Análise
            </Button>
          </Card>
        )}

        {produtor.status === "A" && (
          <div>
            <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                <PackageOpen size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Mural de Oportunidades
                </h2>
                <p className="text-sm text-gray-500">
                  Mercados da sua região estão precisando destes produtos agora.
                </p>
              </div>
            </div>

            {demandasAbertas.length === 0 ? (
              <Card className="p-10 text-center bg-white border-dashed border-gray-300">
                <div className="mx-auto w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4">
                  <CheckCircle className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Mural Limpo!
                </h3>
                <p className="text-gray-500">
                  Nenhum mercado está solicitando produtos no momento. Assim que
                  um pedido for feito, ele aparecerá aqui.
                </p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {demandasAbertas.map((demanda) => {
                  const qtdJaAtendida = demanda.ofertas.reduce(
                    (acc, ofr) => acc + ofr.quantidade,
                    0,
                  );
                  const qtdFaltante = demanda.quantidade - qtdJaAtendida;
                  const porcentagem =
                    (qtdJaAtendida / demanda.quantidade) * 100;

                  return (
                    <Card
                      key={demanda.id}
                      className="p-6 border-green-200 hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {demanda.produto}
                          </h3>
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Precisa-se
                          </span>
                        </div>

                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-1">
                            Status de Fechamento de Carga:
                          </p>
                          <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                            <div
                              className="bg-green-500 h-3"
                              style={{ width: `${porcentagem}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-700">
                              {qtdJaAtendida} garantidos
                            </span>
                            <span className="font-bold text-red-600">
                              Faltam {qtdFaltante} {demanda.unidade}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Eu tenho este produto! Quero ofertar:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            max={qtdFaltante}
                            placeholder={`Max: ${qtdFaltante}`}
                            value={inputsOferta[demanda.id] || ""}
                            onChange={(e) =>
                              setInputsOferta({
                                ...inputsOferta,
                                [demanda.id]: e.target.value,
                              })
                            }
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                          />
                          <Button
                            onClick={() => enviarOferta(demanda)}
                            disabled={enviando || !inputsOferta[demanda.id]}
                            className="bg-green-700 hover:bg-green-800 px-6"
                          >
                            <Handshake size={18} className="mr-2" /> Fechar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
