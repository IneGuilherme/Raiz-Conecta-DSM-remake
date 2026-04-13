import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function SiteHeader() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-green-700 font-bold text-xl">
                    <Leaf className="h-6 w-6" />
                    Raiz Conecta
                </Link>
                <div className="flex gap-3">
                    <Link href="/login" className="px-4 py-2 text-green-700 font-medium hover:bg-green-50 rounded-lg">Entrar</Link>
                    <Link href="/login" className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </header>
    );
}