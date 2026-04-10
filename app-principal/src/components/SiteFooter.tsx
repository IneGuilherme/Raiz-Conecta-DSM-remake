export function SiteFooter() {
    return (
        <footer className="bg-green-900 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="text-green-200">© {new Date().getFullYear()} Raiz Conecta. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}