"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, User, LogOut, Settings, Menu, X } from "lucide-react";

export default function SiteHeader() {
    const router = useRouter();
    const [emailLogado, setEmailLogado] = useState<string | null>(null);
    const [nomeLogado, setNomeLogado] = useState<string | null>(null);
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null); // Referência para fechar ao clicar fora

    // Busca os dados assim que carrega
    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        const nome = localStorage.getItem("userName");

        if (email) {
            setEmailLogado(email);
            // Pega o nome, ou formata o e-mail bonitinho caso não tenha nome
            setNomeLogado(nome ? nome.charAt(0).toUpperCase() + nome.slice(1) : email.split('@')[0]);
        }
    }, []);

    // Fecha o menu se clicar fora dele
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        setEmailLogado(null);
        setNomeLogado(null);
        setMenuAberto(false);
        router.push("/login"); // Expulsa para o login
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

                {/* LADO ESQUERDO: LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-green-600 p-1.5 rounded-lg group-hover:bg-green-700 transition-colors">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-gray-900 tracking-tight">Raiz Conecta</span>
                </Link>

                {/* LADO DIREITO: NAVEGAÇÃO E USUÁRIO */}
                <div className="flex items-center gap-4" ref={menuRef}>

                    {/* SE NÃO ESTIVER LOGADO */}
                    {!emailLogado ? (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-green-700 transition">
                                Entrar
                            </Link>
                            <Link href="/login" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-green-600 transition shadow-md hover:shadow-lg">
                                Cadastre-se
                            </Link>
                        </div>
                    ) : (

                        /* SE ESTIVER LOGADO: Menu Hambúrguer / Perfil */
                        <div className="relative">
                            {/* O Botão que abre o menu (Parece um botão do Google/Apple) */}
                            <button
                                onClick={() => setMenuAberto(!menuAberto)}
                                className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 pr-4 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                            >
                                {/* Ícone de Menu Hambúrguer */}
                                <div className="pl-2 text-gray-500">
                                    {menuAberto ? <X size={20} /> : <Menu size={20} />}
                                </div>

                                {/* Avatar com a Inicial do Nome */}
                                <div className="w-8 h-8 bg-gradient-to-tr from-green-600 to-green-400 rounded-full flex items-center justify-center text-white text-sm font-bold uppercase shadow-inner">
                                    {nomeLogado?.charAt(0) || "U"}
                                </div>
                            </button>

                            {/* O CARD FLUTUANTE DO MENU */}
                            {menuAberto && (
                                <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right">

                                    {/* Cabeçalho do Card: Foco no Nome */}
                                    <div className="p-5 bg-gray-50/50 border-b border-gray-100">
                                        <p className="text-base font-bold text-gray-900 truncate">
                                            Olá, {nomeLogado}
                                        </p>
                                        <p className="text-xs font-medium text-gray-500 truncate mt-0.5">
                                            {emailLogado}
                                        </p>
                                    </div>

                                    {/* Opções do Menu */}
                                    <div className="p-2 space-y-1">
                                        <Link
                                            href="/perfil"
                                            onClick={() => setMenuAberto(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-700 transition"
                                        >
                                            <User size={18} /> Meu Perfil
                                        </Link>

                                        <Link
                                            href="/configuracoes"
                                            onClick={() => setMenuAberto(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-700 transition"
                                        >
                                            <Settings size={18} /> Configurações
                                        </Link>
                                    </div>

                                    {/* Botão de Sair (Destacado) */}
                                    <div className="p-2 border-t border-gray-100 bg-gray-50/30">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition"
                                        >
                                            <LogOut size={18} /> Sair com segurança
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}