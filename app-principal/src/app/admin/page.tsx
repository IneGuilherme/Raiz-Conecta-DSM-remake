"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, FileText, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
    const [pendentes, setPendentes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Busca a lista de quem está "A_ANALISE"
    useEffect(() => {
        carregarPendentes();
    }, []);

    const carregarPendentes = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/produtores");
            const dados = await res.json();
            setPendentes(dados);
        } catch (error) {
            console.error("Erro ao buscar dados");
        } finally {
            setLoading(false);
        }
    };

    // Função para Aprovar ou Rejeitar
    const julgarProdutor = async (email: string, acao: "aprovar" | "rejeitar") => {
        const confirmar = confirm(`Tem certeza que deseja ${acao.toUpperCase()} este produtor?`);
        if (!confirmar) return;

        try {
            await fetch("/api/admin/produtores", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, acao }),
            });

            // Recarrega a lista para a pessoa sumir da tela
            carregarPendentes();
        } catch (error) {
            alert("Erro ao processar a requisição.");
        }
    };

    if (loading) return <p className="p-10 text-center font-bold text-green-700">Carregando painel de controle...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 border-b border-gray-200 pb-4 flex items-center gap-3">
                    <UserCheck className="w-8 h-8 text-green-700" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Auditoria de Produtores</h1>
                        <p className="text-gray-600">Analise os documentos enviados para liberar o acesso à plataforma.</p>
                    </div>
                </header>

                {pendentes.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center">
                        <CheckCircle className="mx-auto w-16 h-16 text-green-300 mb-4" />
                        <h2 className="text-xl font-bold text-gray-700">Tudo limpo por aqui!</h2>
                        <p className="text-gray-500">Nenhum produtor aguardando análise no momento.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {pendentes.map((produtor) => (
                            <Card key={produtor.email} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">

                                {/* Informações do Produtor */}
                                <div className="flex-1 space-y-1">
                                    <h3 className="text-xl font-bold text-gray-800">{produtor.nomeFantasia || "Nome não informado"}</h3>
                                    <p className="text-sm text-gray-600 font-medium">{produtor.documento}</p>
                                    <p className="text-sm text-gray-500">{produtor.email}</p>
                                    <p className="text-sm text-gray-500">Tel: {produtor.telefone}</p>
                                </div>

                                {/* Botão de Ver Documento */}
                                <div className="flex-shrink-0">
                                    <a
                                        href={produtor.urlDocumento}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium border border-blue-200"
                                    >
                                        <FileText size={18} /> Ver Documento Anexado
                                    </a>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    <Button
                                        onClick={() => julgarProdutor(produtor.email, "rejeitar")}
                                        variant="outline"
                                        className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
                                    >
                                        <XCircle size={18} /> Rejeitar
                                    </Button>

                                    <Button
                                        onClick={() => julgarProdutor(produtor.email, "aprovar")}
                                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white gap-2"
                                    >
                                        <CheckCircle size={18} /> Aprovar Nível Raiz
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}