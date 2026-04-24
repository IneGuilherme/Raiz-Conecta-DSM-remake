"use client";

import { useEffect, useState } from "react";
import { UploadCloud, Clock, CheckCircle, ShieldCheck, XCircle, PackageOpen, Handshake, MapPin, FileText, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Demanda {
  id: string;
  produto: string;
  quantidade: number;
  unidade: string;
  status: string;
  ofertas: { quantidade: number; emailProdutor: string }[];
}

interface PerfilProdutor {
  email: string;
  nomeFantasia: string;
  status: string;
  documento?: string;
}

export default function PainelProdutor() {
  const [produtor, setProdutor] = useState<PerfilProdutor | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário Passo 2
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [formDados, setFormDados] = useState({
    tipoDoc: "CPF",
    documento: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  const [demandasAbertas, setDemandasAbertas] = useState<Demanda[]>([]);
  const [inputsOferta, setInputsOferta] = useState<{ [key: string]: string }>({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const emailLogado = localStorage.getItem("userEmail");
      if (emailLogado) {
        try {
          const resPerfil = await fetch(`/api/vendedor/perfil?email=${emailLogado}`);
          if (resPerfil.ok) {
            const dadosPerfil = await resPerfil.json();
            setProdutor(dadosPerfil);

            if (dadosPerfil.status === "APROVADO") {
              buscarOportunidades();
            }
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
      setDemandasAbertas(todasDemandas.filter((d: Demanda) => d.status === "ABERTA"));
    } catch (err) {
      console.error("Erro ao buscar demandas", err);
    }
  };

  // Mágica do ViaCEP 🪄
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cepDigitado = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    setFormDados({ ...formDados, cep: e.target.value });

    if (cepDigitado.length === 8) {
      setBuscandoCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormDados(prev => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }));
        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormDados({ ...formDados, [e.target.name]: e.target.value });
  };

  const enviarDadosFaltantes = async () => {
    if (!arquivo) return alert("Por favor, anexe a foto do seu documento de identificação.");
    if (!formDados.documento || !formDados.cep || !formDados.rua) {
      return alert("Por favor, preencha todos os campos textuais obrigatórios.");
    }

    setLoading(true);
    const emailLogado = localStorage.getItem("userEmail");

    const formData = new FormData();
    formData.append("email", emailLogado!);
    formData.append("tipoUsuario", "produtor");
    formData.append("tipoDoc", formDados.tipoDoc);
    formData.append("documento", formDados.documento);
    formData.append("cep", formDados.cep);
    formData.append("rua", formDados.rua);
    formData.append("numero", formDados.numero);
    formData.append("bairro", formDados.bairro);
    formData.append("cidade", formDados.cidade);
    formData.append("estado", formDados.estado);
    formData.append("file", arquivo);

    try {
      const res = await fetch("/api/perfil/completar", { method: "POST", body: formData });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Erro ao salvar os dados.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
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
        body: JSON.stringify({ demandaId: demanda.id, quantidade: quantidade, emailProdutor: produtor.email }),
      });
      if (res.ok) {
        alert("Negócio fechado! Sua oferta foi registrada.");
        setInputsOferta({ ...inputsOferta, [demanda.id]: "" });
        buscarOportunidades();
      } else {
        const dados = await res.json();
        alert(dados.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <p className="p-10 text-center font-bold text-green-700">Carregando portal...</p>;
  if (!produtor) return <p className="p-10 text-center">Usuário não encontrado. Faça login novamente.</p>;

  const precisaPreencherPerfil = !produtor.documento;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-900 uppercase">Olá, {produtor.nomeFantasia || "Produtor"}</h1>
            <p className="text-gray-600 font-light mt-1">Status da Conta:
              <span className={`font-bold ml-2 px-3 py-1 rounded-full text-sm ${produtor.status === 'APROVADO' ? 'text-green-700 bg-green-100' : produtor.status === 'REJEITADO' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100'}`}>
                {produtor.status === 'APROVADO' ? 'Raiz 🌳 (Ativo)' : produtor.status === 'REJEITADO' ? 'Recusado ❌' : 'Em Análise ⏳'}
              </span>
            </p>
          </div>
        </header>

        {/* ========== TELA DE ONBOARDING (PASSO 2) ========== */}
        {(precisaPreencherPerfil || produtor.status === "REJEITADO") && (
          <Card className={`p-8 bg-white shadow-lg border-t-4 ${produtor.status === "REJEITADO" ? "border-t-red-500" : "border-t-green-500"}`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className={`p-3 rounded-full ${produtor.status === "REJEITADO" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                {produtor.status === "REJEITADO" ? <XCircle size={28} /> : <ShieldCheck size={28} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {produtor.status === "REJEITADO" ? "Documentação Recusada" : "Finalize seu Cadastro"}
                </h2>
                <p className="text-gray-500 text-sm">
                  {produtor.status === "REJEITADO" ? "Houve um problema com seus dados. Por favor, corrija e reenvie." : "Precisamos dos seus dados para liberação do sistema."}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4"><FileText size={18} /> Documentação</h3>

                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Tipo</label>
                    <select name="tipoDoc" value={formDados.tipoDoc} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                    </select>
                  </div>
                  <div className="w-2/3">
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Número do Documento</label>
                    <input type="text" name="documento" value={formDados.documento} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Apenas números" />
                  </div>
                </div>

                <h3 className="font-bold text-gray-700 flex items-center gap-2 mt-6 mb-4"><MapPin size={18} /> Endereço</h3>

                <div className="flex gap-4">
                  <div className="w-1/2 relative">
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">CEP</label>
                    <input type="text" name="cep" placeholder="Apenas números" maxLength={8} value={formDados.cep} onChange={handleCepChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                    {buscandoCep && <Loader2 className="absolute right-3 top-9 text-green-500 animate-spin" size={18} />}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-3/4">
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Rua / Estrada / Fazenda</label>
                    <input type="text" name="rua" value={formDados.rua} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50" />
                  </div>
                  <div className="w-1/4">
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Número</label>
                    <input type="text" name="numero" value={formDados.numero} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="S/N" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Bairro</label>
                    <input type="text" name="bairro" value={formDados.bairro} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-gray-50" />
                  </div>
                  <div className="w-1/3">
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Cidade</label>
                    <input type="text" name="cidade" value={formDados.cidade} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-gray-50" />
                  </div>
                  <div className="w-1/3">
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Estado</label>
                    <input type="text" name="estado" value={formDados.estado} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-gray-50" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4"><UploadCloud size={18} /> Anexar Documento</h3>
                <div className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${arquivo ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                  <input type="file" className="hidden" id="fileDoc" accept="image/*,.pdf" onChange={(e) => setArquivo(e.target.files?.[0] || null)} />
                  <label htmlFor="fileDoc" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                    <UploadCloud className={`w-12 h-12 mb-3 ${arquivo ? 'text-green-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-bold text-center px-4 text-gray-700">
                      {arquivo ? `Arquivo: ${arquivo.name}` : "Clique para anexar foto do RG, CNH ou Cartão CNPJ"}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Button onClick={enviarDadosFaltantes} className="w-full bg-green-700 hover:bg-green-800 py-6 text-lg font-bold shadow-lg">
                Enviar para Análise da Administração
              </Button>
            </div>
          </Card>
        )}

        {/* ========== TELA DE ESPERA ========== */}
        {!precisaPreencherPerfil && produtor.status === "EM_ANALISE" && (
          <Card className="p-12 text-center shadow-md border-t-4 border-t-amber-500">
            <Clock size={56} className="mx-auto text-amber-500 mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800">Tudo certo por aqui!</h2>
            <p className="text-gray-600 mt-4 text-lg">Nossa equipe está analisando seu cadastro e logo você poderá acessar as vendas.</p>
          </Card>
        )}

        {/* ========== MURAL (Apenas visualização omitida para economizar espaço, continua igual) ========== */}
        {/* Aqui vai o código do Mural de Oportunidades igualzinho ao passo anterior */}
      </div>
    </div>
  );
}