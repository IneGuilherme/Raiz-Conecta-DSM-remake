import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false, // Desabilita o modo estrito do React para evitar erros relacionados a componentes de terceiros
};

export default nextConfig;
