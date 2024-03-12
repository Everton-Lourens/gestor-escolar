// MeuComponente.tsx
import React from 'react';

interface Props {
  nome: string;
}

const MeuComponente: React.FC<Props> = ({ nome }) => {
  return (
    <div>
      <p>Olá, {nome}!</p>
    </div>
  );
};

export default MeuComponente;
