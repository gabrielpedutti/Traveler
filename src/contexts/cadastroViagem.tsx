import { createContext, ReactNode, useState } from "react";

interface CadastroViagemContextType {
  viagem: CadastroViagemResponseDto;
  salvarDadosViagem: (viagem: CadastroViagemResponseDto) => void;
}

export const CadastroViagemContext = createContext<CadastroViagemContextType>({} as CadastroViagemContextType);

interface CadastroViagemProviderProps {
  children: ReactNode;
}

function CadastroViagemProvider({ children }: CadastroViagemProviderProps) {

  const [viagem, setViagem] = useState<CadastroViagemResponseDto>({});

  function salvarDadosViagem(viagem: CadastroViagemResponseDto) {
    setViagem(viagem);
  }

  return (
    <CadastroViagemContext.Provider value={{salvarDadosViagem, viagem}}>
      {children}
    </CadastroViagemContext.Provider>
  )
}

export default CadastroViagemProvider;