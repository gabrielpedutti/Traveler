import { createContext, useState } from "react";
import { useNavigation } from '@react-navigation/native';

export const CadastroContext = createContext({})

function CadastroProvider({children}) {
  const [user, setUser] = useState({})
  const navigation = useNavigation();

  function salvarDados(cadastro) {
    setUser(cadastro);
    navigation.navigate('Login');
  }

  return(
    <CadastroContext.Provider value={{salvarDados, user}}>
      {children}
    </CadastroContext.Provider>
  )
}

export default CadastroProvider;