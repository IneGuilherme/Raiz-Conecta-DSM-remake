'use client';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
  spec: Record<string, any>;
};

// Desativa o StrictMode localmente para evitar o warning do swagger-ui-react
// (componente interno "ModelCollapse" usa lifecycle deprecated — bug da lib, não do nosso código)
function NoStrictMode({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Substitui o StrictMode do React pelo wrapper neutro apenas nesta árvore
const OriginalStrictMode = React.StrictMode;
(React as any).StrictMode = NoStrictMode;

export default function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}

// Restaura o StrictMode original para não afetar o resto da aplicação
(React as any).StrictMode = OriginalStrictMode;