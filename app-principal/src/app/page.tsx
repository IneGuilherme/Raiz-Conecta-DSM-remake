import Link from "next/link";
import { Leaf, Truck, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 lg:py-32" id="inicio">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4 tracking-tight">
                Tecnologia <br />
                <span className="text-green-600">Da Raiz ao Fruto</span>
              </h1>

              <h3 className="text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-8">
                Uma plataforma digital que otimiza a cadeia de suprimentos de alimentos.
                Conectando produtores e mercados para facilitar o acesso a alimentos frescos em um só lugar.
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/login"
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium shadow-lg hover:bg-green-700 transition-all text-center"
                >
                  Começar Agora
                </Link>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="rounded-2xl shadow-2xl aspect-video bg-green-100 flex items-center justify-center border-4 border-white">
                <p className="text-green-600 font-bold">Lugar da Imagem (HORTA.jpg)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" id="sobre">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg">
            <h2 className="text-center font-bold text-green-700 mb-12 text-2xl md:text-3xl">
              Revolucionando o caminho do hortifruti até você.
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  A missão do <strong>Raiz Conecta</strong> é aproximar produtores e compradores,
                  facilitando negociações diretas, diminuindo o desperdício de alimentos e
                  promovendo preços mais justos.
                </p>
              </div>
              <div className="md:w-1/2 w-full max-w-md mx-auto">
                <div className="rounded-2xl shadow-md aspect-video bg-green-100 flex items-center justify-center">
                  <p className="text-green-600 font-bold">Lugar da Imagem (Colheita.jpg)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" id="funcionalidades">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-bold text-green-800 mb-12 text-3xl">
            Funcionalidades Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: "Sustentabilidade", text: "Reduza desperdícios e consuma de forma consciente." },
              { icon: Truck, title: "Logística", text: "Entregas integradas entre produtores e mercados." },
              { icon: TrendingUp, title: "Transparência", text: "Sistema de avaliação e controle de qualidade." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white text-center p-8 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="flex justify-center mb-6 text-green-600">
                  <item.icon size={40} />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}