"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PerfilPage() {
    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {
        async function buscarDados() {
            const email = localStorage.getItem("userEmail");
            const res = await fetch(`/api/vendedor/perfil?email=${email}`);
            const dados = await res.json();
            setUsuario(dados);
        }
        buscarDados();
    }, []);

    if (!usuario) return <p className="p-10 text-center">Carregando perfil...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

                <Card className="p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-700 border-4 border-white shadow-md overflow-hidden text-4xl font-bold">
                                {usuario.urlDocumento ? (
                                    <img src={usuario.urlDocumento} className="w-full h-full object-cover" alt="Perfil" />
                                ) : (
                                    usuario.nomeFantasia?.charAt(0) || "U"
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-green-600 hover:bg-green-50 transition">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-gray-900">{usuario.nomeFantasia || "Nome não cadastrado"}</h2>
                        <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full mt-2">
                            Status: {usuario.status === 'A' ? 'Verificado' : 'Pendente'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">E-mail</p>
                                <p className="text-gray-800 font-medium">{usuario.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Telefone</p>
                                <p className="text-gray-800 font-medium">{usuario.telefone || "Não informado"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Cidade</p>
                                <p className="text-gray-800 font-medium">{usuario.cidade ? `${usuario.cidade} - ${usuario.estado}` : "Não informado"}</p>
                            </div>
                        </div>
                    </div>

                    <Button className="mt-8 w-full py-6" variant="outline">
                        Editar Informações
                    </Button>
                </Card>
            </div>
        </div>
    );
}