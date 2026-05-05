import { createSwaggerSpec } from 'next-swagger-doc';
import ReactSwagger from './ReactSwagger';

export default async function ApiDocsPage() {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Documentação da API',
        version: '1.0.0',
      },
      // Aqui nós passamos as rotas direto via código, sem depender de comentários!
      paths: {
        '/api/admin/usuarios': {
          get: { 
            summary: 'Lista todos os usuários', 
            responses: { '200': { description: 'Sucesso' } } 
          },
          put: { 
            summary: 'Atualiza o status de um usuário', 
            responses: { '200': { description: 'Sucesso' } } 
          },
          delete: { 
            summary: 'Exclui um usuário', 
            responses: { '200': { description: 'Sucesso' } } 
          }
        }
      }
    },
    apis: [], // Deixe vazio para ele não procurar comentários nos arquivos
  });

  return (
    <section className="bg-white min-h-screen p-8">
      <ReactSwagger spec={spec} />
    </section>
  );
}