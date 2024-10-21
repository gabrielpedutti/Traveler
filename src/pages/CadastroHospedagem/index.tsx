import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import Input from "../../components/InputCadastro";

function CadastroHospedagem(props) {
  return(
    <>
      <Titulo texto="Cadastro de Hospedagem" />
      <Input
        label="Local"
        placeholder="Digite o nome do Local"
        onChangeText=''
      />
    </>
  )
}

export default CadastroHospedagem;

