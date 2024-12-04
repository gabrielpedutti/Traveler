import { createContext, ReactNode, useState } from "react";

interface CadastroViagemContextType {
  viagem: GetViagemResponseDto;
  salvarDadosViagem: (viagem: GetViagemResponseDto) => void;
}

export const CadastroViagemContext = createContext<CadastroViagemContextType>({} as CadastroViagemContextType);

interface CadastroViagemProviderProps {
  children: ReactNode;
}

function CadastroViagemProvider({ children }: CadastroViagemProviderProps) {

  const [viagem, setViagem] = useState<GetViagemResponseDto>({});

  function salvarDadosViagem(viagem: GetViagemResponseDto) {
    setViagem(viagem);
  }

  return (
    <CadastroViagemContext.Provider value={{salvarDadosViagem, viagem}}>
      {children}
    </CadastroViagemContext.Provider>
  )
}

export default CadastroViagemProvider;