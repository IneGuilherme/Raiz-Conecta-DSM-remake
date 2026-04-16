"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, User, LogOut, Settings, ChevronDown } from "lucide-react";

export default function SiteHeader() {
    const router = useRouter();
    const [emailLogado, setEmailLogado] = useState<string | null>(null);
    const [menuAberto, setMenuAberto] = useState(false);

    // Monitora o localStorage para saber se o usuário está logado
    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (email) setEmailLogado(email);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        setEmailLogado(null);
        setMenuAberto(false);
        router.push("/login");
    };

    return (
        <header className="bg-white border-b border-green-100 py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 text-green-700 font-bold text-xl">
                    <Leaf className="w-6 h-6" />
                    <span>Raiz Conecta</span>
                </Link>

                {/* NAVEGAÇÃO / USER AREA */}
                <nav className="flex items-center gap-6">
                    {!emailLogado ? (
                        // VISÃO DESLOGADO
                        <>
                            <Link href="/login" className="text-gray-600 hover:text-green-700 font-medium">Entrar</Link>
                            <Link href="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                Cadastre-se
                            </Link>
                        </>
                    ) : (
                        // VISÃO LOGADO (Dropdown)
                        <div className="relative">
                            <button
                                onClick={() => setMenuAberto(!menuAberto)}
                                className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {emailLogado.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline">{emailLogado}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${menuAberto ? 'rotate-180' : ''}`} />
                            </button>

                            {/* MENU DROPDOWN */}
                            {menuAberto && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                                    <Link
                                        href="/perfil"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                        onClick={() => setMenuAberto(false)}
                                    >
                                        <User className="w-4 h-4" /> Meu Perfil
                                    </Link>
                                    <Link
                                        href="/configuracoes"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                        onClick={() => setMenuAberto(false)}
                                    >
                                        <Settings className="w-4 h-4" /> Configurações
                                    </Link>
                                    <hr className="my-2 border-gray-50" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                                    >
                                        <LogOut className="w-4 h-4" /> Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}