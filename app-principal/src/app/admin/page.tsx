/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Users,
  Ban,
  Trash2,
  Search,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PainelAdmin() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);

  // Abas e Filtros
  const [abaAtual, setAbaAtual] = useState<"pendentes" | "gestao">("pendentes");
  const [filtroBusca, setFiltroBusca] = useState("");

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/usuarios");
      if (res.ok) setUsuarios(await res.json());
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const alterarStatus = async (
    email: string,
    tipo: string,
    novoStatus: string,
  ) => {
    const acao =
      novoStatus === "SUSPENSO"
        ? "suspender"
        : novoStatus === "APROVADO"
          ? "aprovar/reativar"
          : "rejeitar";
    if (!confirm(`Tem certeza que deseja ${acao} este usuário?`)) return;

    setProcessando(email);
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tipo, novoStatus }),
      });
      if (res.ok) carregarUsuarios();
      else alert("Erro ao alterar status.");
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setProcessando(null);
    }
  };

  const excluirUsuario = async (email: string, tipo: string) => {
    if (
      !confirm(
        "⚠️ EXCLUSÃO PERMANENTE: Tem certeza que deseja apagar este usuário do banco de dados?",
      )
    )
      return;

    setProcessando(email);
    try {
      const res = await fetch(
        `/api/admin/usuarios?email=${email}&tipo=${tipo}`,
        { method: "DELETE" },
      );
      if (res.ok) carregarUsuarios();
      else
        alert(
          "Erro ao excluir. O usuário pode ter histórico de pedidos no sistema.",
        );
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setProcessando(null);
    }
  };

  if (loading && usuarios.length === 0)
    return (
      <div className="p-20 text-center font-bold text-gray-600 flex justify-center">
        <Loader2 className="animate-spin mr-2" /> Carregando sistema...
      </div>
    );

  // Filtra as listas
  const pendentes = usuarios.filter((u) => u.status === "EM_ANALISE");
  const ativos = usuarios.filter((u) => u.status !== "EM_ANALISE");

  const listaGestao = ativos.filter(
    (u) =>
      (u.nomeFantasia || u.razaoSocial)
        ?.toLowerCase()
        .includes(filtroBusca.toLowerCase()) ||
      u.email.toLowerCase().includes(filtroBusca.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-350 mx-auto p-4 md:p-8 space-y-6">
        {/* NAVEGAÇÃO POR ABAS */}
        <div className="flex justify-between items-end border-b border-gray-200 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setAbaAtual("pendentes")}
              className={`flex items-center gap-2 px-4 py-3 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${abaAtual === "pendentes" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
              <FileText size={18} /> Aprovações Pendentes
              {pendentes.length > 0 && (
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs ml-1">
                  {pendentes.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAbaAtual("gestao")}
              className={`flex items-center gap-2 px-4 py-3 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${abaAtual === "gestao" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
              <Users size={18} /> Gestão de Usuários
            </button>
          </div>
          <button
            onClick={carregarUsuarios}
            className="text-gray-400 hover:text-gray-800 pb-3 flex items-center gap-1 text-sm font-bold"
          >
            <RefreshCw size={16} /> Atualizar
          </button>
        </div>

        {/* ABA 1: APROVAÇÕES PENDENTES */}
        {abaAtual === "pendentes" && (
          <div>
            {pendentes.length === 0 ? (
              <Card className="p-20 text-center bg-white border border-dashed border-gray-300 shadow-sm">
                <CheckCircle
                  size={56}
                  className="mx-auto mb-4 text-green-300"
                />
                <h2 className="text-xl font-black text-gray-700">
                  Tudo limpo por aqui!
                </h2>
                <p className="text-gray-500">
                  Não há novos cadastros aguardando aprovação.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pendentes.map((user) => (
                  <Card
                    key={user.email}
                    className="p-6 border-amber-200 shadow-sm bg-amber-50/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4 border-b border-amber-100 pb-4">
                        <div>
                          <span
                            className={`text-[10px] font-black px-2 py-1 rounded uppercase ${user.tipo === "produtor" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                          >
                            {user.tipo === "produtor"
                              ? "Produtor Rural"
                              : "Mercado"}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 mt-2">
                            {user.nomeFantasia || user.razaoSocial}
                          </h3>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-700 mb-6">
                        <p>
                          <strong>{user.tipoDoc || "Doc"}:</strong>{" "}
                          {user.documento}
                        </p>
                        <p>
                          <strong>Cidade:</strong> {user.cidade} - {user.estado}
                        </p>
                        {user.urlDocumento && (
                          <a
                            href={user.urlDocumento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-bold hover:underline flex items-center gap-1 mt-2"
                          >
                            <FileText size={16} /> Ver Foto do Documento
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          alterarStatus(user.email, user.tipo, "REJEITADO")
                        }
                        disabled={processando === user.email}
                        variant="outline"
                        className="w-1/2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        <XCircle size={18} className="mr-1" /> Recusar
                      </Button>
                      <Button
                        onClick={() =>
                          alterarStatus(user.email, user.tipo, "APROVADO")
                        }
                        disabled={processando === user.email}
                        className="w-1/2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={18} className="mr-1" /> Aprovar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA 2: GESTÃO DE USUÁRIOS ATIVOS */}
        {abaAtual === "gestao" && (
          <Card className="bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800">
                Usuários na Base de Dados
              </h2>
              <div className="relative w-full md:w-72">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar usuário ou e-mail..."
                  value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold border-b border-gray-200">
                      Usuário
                    </th>
                    <th className="p-4 font-bold border-b border-gray-200">
                      Tipo
                    </th>
                    <th className="p-4 font-bold border-b border-gray-200">
                      Status
                    </th>
                    <th className="p-4 font-bold border-b border-gray-200 text-right">
                      Ações de Risco
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {listaGestao.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    listaGestao.map((user) => (
                      <tr
                        key={user.email}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <p className="font-bold text-gray-900">
                            {user.nomeFantasia || user.razaoSocial}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${user.tipo === "produtor" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {user.tipo}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`flex items-center gap-1 text-xs font-bold ${user.status === "APROVADO" ? "text-green-600" : user.status === "SUSPENSO" ? "text-amber-600" : "text-red-600"}`}
                          >
                            {user.status === "APROVADO" ? (
                              <CheckCircle size={14} />
                            ) : user.status === "SUSPENSO" ? (
                              <Ban size={14} />
                            ) : (
                              <XCircle size={14} />
                            )}
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {user.status === "APROVADO" ? (
                            <button
                              onClick={() =>
                                alterarStatus(user.email, user.tipo, "SUSPENSO")
                              }
                              disabled={processando === user.email}
                              className="px-3 py-1.5 text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition"
                            >
                              Suspender
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                alterarStatus(user.email, user.tipo, "APROVADO")
                              }
                              disabled={processando === user.email}
                              className="px-3 py-1.5 text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition"
                            >
                              Reativar
                            </button>
                          )}

                          <button
                            onClick={() =>
                              excluirUsuario(user.email, user.tipo)
                            }
                            disabled={processando === user.email}
                            className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition"
                            title="Excluir Permanentemente"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
