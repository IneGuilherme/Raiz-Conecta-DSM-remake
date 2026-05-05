/* eslint-disable @typescript-eslint/no-explicit-any */
import swaggerSpec from '@/swagger.json';
import ReactSwagger from './ReactSwagger';

export default function ApiDocsPage() {
  return (
    <section className="bg-white min-h-screen p-8">
      <ReactSwagger spec={swaggerSpec as Record<string, any>} />
    </section>
  );
}