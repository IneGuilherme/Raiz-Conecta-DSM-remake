"use client";

import { useEffect, useState } from "react";
import { UploadCloud, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PainelProdutor() {
    const [produtor, setProdutor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Novo estado para guardar o arquivo que o usuário escolheu
    const [arquivo, setArquivo] = useState<File | null>(null);

    useEffect(() => {
        async function carregarPerfil() {
            const emailLogado = localStorage.getItem("userEmail");
            if (emailLogado) {
                const res = await fetch(`/api/vendedor/perfil?email=${emailLogado}`);
                const dados = await res.json();
                setProdutor(dados);
            }
            setLoading(false);
        }
        carregarPerfil();
    }, []);

    const enviarParaAnalise = async () => {
        if (!arquivo) {
            alert("Por favor, selecione a foto do documento primeiro.");
            return;
        }

        setLoading(true);
        const emailLogado = localStorage.getItem("userEmail");

        // Como estamos enviando um ARQUIVO (e não texto), usamos o FormData
        const formData = new FormData();
        formData.append("email", emailLogado!);
        formData.append("file", arquivo);

        try {
            await fetch("/api/vendedor/perfil", {
                method: "POST",
                body: formData // Manda o form inteiro com o arquivo
            });
            // Recarrega a página para o sistema ver que ele agora é um "Broto"
            window.location.reload();
        } catch (error) {
            alert("Erro ao enviar arquivo.");
            setLoading(false);
        }
    };

    if (loading) return <p className="p-10 text-center font-bold text-green-700">Carregando portal...</p>;
    if (!produtor) return <p className="p-10 text-center">Usuário não encontrado. Faça login novamente.</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-green-900 uppercase">Olá, {produtor.nomeFantasia || "Produtor"}</h1>
                        <p className="text-gray-600 font-light mt-1">Nível de Acesso:
                            <span className="font-bold ml-2 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm">
                                {produtor.status === 'P' ? 'Semente 🌱' : produtor.status === 'A_ANALISE' ? 'Broto 🌿' : 'Raiz 🌳'}
                            </span>
                        </p>
                    </div>
                </header>

                {produtor.status === "P" && (
                    <Card className="p-8 border-orange-200 bg-orange-50/20">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <ShieldCheck className="text-orange-500" /> Nível Semente: Primeiros Passos
                        </h2>
                        <p className="text-gray-600 my-4">Seu acesso é limitado. Envie uma foto do seu documento de identidade ou CAF/DAP para liberar as vendas.</p>

                        <div className={`border-2 border-dashed p-8 rounded-xl text-center transition-colors ${arquivo ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                            {/* O Input de arquivo escondido */}
                            <input
                                type="file"
                                className="hidden"
                                id="fileDoc"
                                accept="image/*,.pdf"
                                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                            />
                            <label htmlFor="fileDoc" className="cursor-pointer block">
                                <UploadCloud className={`mx-auto w-12 h-12 mb-3 ${arquivo ? 'text-green-500' : 'text-gray-400'}`} />
                                <p className="text-sm font-bold text-gray-700">
                                    {arquivo ? `Arquivo selecionado: ${arquivo.name}` : "Clique para anexar documento (Foto ou PDF)"}
                                </p>
                                {!arquivo && <p className="text-xs text-gray-500 mt-2">Máximo 5MB.</p>}
                            </label>
                        </div>

                        <Button onClick={enviarParaAnalise} className="mt-6 w-full bg-green-700 hover:bg-green-800 py-6 text-lg">
                            Enviar Documento e Subir de Nível
                        </Button>
                    </Card>
                )}

                {produtor.status === "A_ANALISE" && (
                    <Card className="p-12 text-center shadow-md border-t-4 border-t-amber-500">
                        <Clock size={56} className="mx-auto text-amber-500 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800">Documentação em Auditoria</h2>
                        <p className="text-gray-600 mt-4 text-lg">
                            Você enviou os documentos e agora é um <strong>Broto</strong>! 🌱 <br />
                            Nossa equipe administrativa está conferindo seus dados. Logo você será um produtor raiz com acesso total.
                        </p>
                    </Card>
                )}

                {produtor.status === "A" && (
                    <div className="bg-green-600 p-8 rounded-2xl text-white shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <CheckCircle size={40} className="text-green-200" />
                            <h2 className="text-3xl font-bold">Nível Raiz Alcançado! 🌳</h2>
                        </div>
                        <p className="opacity-90 text-lg mb-6">Sua documentação foi aprovada. Você é um produtor verificado e pode cadastrar produtos na plataforma.</p>
                        <Button className="bg-white text-green-700 hover:bg-green-50 font-bold border-none px-8 py-6">+ Cadastrar Novo Produto</Button>
                    </div>
                )}
            </div>
        </div>
    );
}