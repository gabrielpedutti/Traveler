import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import Input from "../../components/InputCadastro";

function CadastroTransporte(props) {
  return(
    <>
      <Titulo texto="Cadastro de Transporte" />
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

export default CadastroTransporte;

