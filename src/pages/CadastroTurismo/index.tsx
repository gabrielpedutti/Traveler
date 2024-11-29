import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";
import Input from "../../components/InputCadastro";
import Titulo from "../../components/Titulo";

function CadastroTurismo(props) {
  return(
    <>
      <Titulo texto="Cadastro de Turismo" />
      <Input
        label="Origem"
        placeholder="Digite o nome do local de origem"
        onChangeText=''
      />
      <Input
        label="Destino"
        placeholder="Digite o nome do local de destino"
        onChangeText=''
      />
    </>
  )
}

export default CadastroTurismo;

