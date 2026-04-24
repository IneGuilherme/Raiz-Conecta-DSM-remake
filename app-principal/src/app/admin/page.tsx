"use client";

import { useEffect, useState } from "react";
import { CheckCircle, FileText, Store, Tractor } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
    const [produtores, setProdutores] = useState<any[]>([]);
    const [mercados, setMercados] = useState<any[]>([]);
    const [ativos, setAtivos] = useState<any[]>([]); // NOVO: Estado para os usuários ativos
    const [loading, setLoading] = useState(true);
    const [abaAtual, setAbaAtual] = useState<"produtores" | "mercados" | "ativos">("produtores");

    const carregarUsuarios = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/usuarios");
            if (res.ok) {
                const data = await res.json();
                setProdutores(data.produtores || []);
                setMercados(data.mercados || []);
                setAtivos(data.ativos || []); // NOVO: Salva os ativos vindos da API
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const handleAcao = async (email: string, tipo: string, acao: "aprovar" | "rejeitar") => {
        if (!confirm(`Tem certeza que deseja ${acao} este usuário?`)) return;

        try {
            const res = await fetch("/api/admin/usuarios", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, tipo, acao })
            });

            if (res.ok) {
                alert(`Usuário ${acao === 'aprovar' ? 'aprovado' : 'rejeitado'} com sucesso! E-mail disparado.`);
                carregarUsuarios(); // Recarrega a lista
            }
        } catch (err) {
            alert("Erro ao executar ação.");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-700">Carregando painel de auditoria...</div>;

    const listaAtual = abaAtual === "produtores" ? produtores : mercados;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Painel de Auditoria</h1>
                    <p className="text-gray-600">Aprove ou rejeite a entrada de novos usuários na plataforma Raiz Conecta.</p>
                </header>

                {/* Controle de Abas */}
                <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-200 pb-2">
                    <button
                        onClick={() => setAbaAtual("produtores")}
                        className={`flex items-center gap-2 font-bold px-4 py-2 border-b-2 transition-colors ${abaAtual === "produtores" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                    >
                        <Tractor size={20} /> Produtores Aguardando ({produtores.length})
                    </button>
                    <button
                        onClick={() => setAbaAtual("mercados")}
                        className={`flex items-center gap-2 font-bold px-4 py-2 border-b-2 transition-colors ${abaAtual === "mercados" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                    >
                        <Store size={20} /> Mercados Aguardando ({mercados.length})
                    </button>
                    <button
                        onClick={() => setAbaAtual("ativos")}
                        className={`flex items-center gap-2 font-bold px-4 py-2 border-b-2 transition-colors ${abaAtual === "ativos" ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                    >
                        <CheckCircle size={20} /> Usuários Ativos ({ativos.length})
                    </button>
                </div>

                {/* =========================================
                    RENDERIZAÇÃO DA ABA DE ATIVOS
                ========================================= */}
                {abaAtual === "ativos" && (
                    ativos.length === 0 ? (
                        <Card className="p-12 text-center text-gray-500 border-dashed">
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-bold mb-2">Nenhum usuário ativo ainda.</h3>
                            <p>Aprove usuários nas outras abas para que eles apareçam aqui.</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {ativos.map((user: any) => (
                                <Card key={user.email} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-l-emerald-500">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                            {user.nomeFantasia || user.razaoSocial}
                                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold tracking-wider uppercase">
                                                {user.tipo}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {user.email} • Registrado em: {new Date(user.criadoEm).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                        <CheckCircle size={18} /> Operando
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                )}

                {/* =========================================
                    RENDERIZAÇÃO DAS ABAS DE AGUARDANDO
                ========================================= */}
                {abaAtual !== "ativos" && (
                    listaAtual.length === 0 ? (
                        <Card className="p-12 text-center text-gray-500 border-dashed">
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-bold mb-2">Tudo limpo!</h3>
                            <p>Nenhum {abaAtual === "produtores" ? "produtor" : "mercado"} aguardando auditoria no momento.</p>
                        </Card>
                    ) : (
                        <div className="grid gap-6">
                            {listaAtual.map((user) => (
                                <Card key={user.email} className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">

                                    <div className="flex-1 w-full space-y-2">
                                        <div className="flex items-center gap-2">
                                            {abaAtual === "produtores" ? <Tractor className="text-green-600" /> : <Store className="text-blue-600" />}
                                            <h3 className="text-xl font-bold text-gray-900">{user.nomeFantasia || user.razaoSocial}</h3>
                                        </div>
                                        <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-2">
                                            <span><span className="font-semibold text-gray-700">E-mail:</span> {user.email}</span>
                                            <span><span className="font-semibold text-gray-700">{user.tipoDoc || "Doc"}:</span> {user.documento}</span>
                                            <span><span className="font-semibold text-gray-700">CEP:</span> {user.cep}</span>
                                            <span><span className="font-semibold text-gray-700">Endereço:</span> {user.rua}, {user.numero} - {user.cidade}/{user.estado}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                                        {user.urlDocumento ? (
                                            <a href={user.urlDocumento} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-semibold text-sm w-full sm:w-auto">
                                                <FileText size={24} className="mb-1 text-blue-600" />
                                                Ver Documento
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic text-center">Sem anexo</span>
                                        )}

                                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                                            <Button onClick={() => handleAcao(user.email, abaAtual === "produtores" ? "produtor" : "mercado", "aprovar")} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                                                Aprovar
                                            </Button>
                                            <Button onClick={() => handleAcao(user.email, abaAtual === "produtores" ? "produtor" : "mercado", "rejeitar")} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto">
                                                Rejeitar
                                            </Button>
                                        </div>
                                    </div>

                                </Card>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}