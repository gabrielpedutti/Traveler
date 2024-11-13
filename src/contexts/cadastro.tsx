import React, { createContext, useState, ReactNode } from "react";
import { useNavigation } from '@react-navigation/native';

interface User {
  email?: string;
  senha?: string;
  nome?: string;
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
