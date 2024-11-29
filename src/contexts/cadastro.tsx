import React, { createContext, useState, ReactNode } from "react";
import { useNavigation } from '@react-navigation/native';

interface User {
  id?: string,
  nome?: string,
  data_nascimento?: string,
  email?: string,
  municipio_id?: number,
  tipo_usuario_id?: number,
  tipo_cadastro_id?: number,
}

interface CadastroContextType { //Aqui ficará tudo que o Context irá compartilhar
  salvarDados: (cadastro: User) => void;
  user: User;
}

export const CadastroContext = createContext<CadastroContextType>({} as CadastroContextType);

interface CadastroProviderProps {
  children: ReactNode;
}

function CadastroProvider({ children }: CadastroProviderProps) {
  const [user, setUser] = useState<User>({});

  function salvarDados(cadastro: User) {
    setUser(cadastro);
  }

  return (
    <CadastroContext.Provider value={{ salvarDados, user }}>
      {children}
    </CadastroContext.Provider>
  )
}

export default CadastroProvider;
