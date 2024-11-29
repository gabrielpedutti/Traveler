import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";
import HeaderFixo from "../../components/HeaderFixo";
import MenuTopCadastroViagem from "../../components/MenuTopCadastroViagem";

function BaseCadastroViagem(props) {
  return(
    <>
      <HeaderFixo />
      <MenuTopCadastroViagem />
    </>
  )
}

export default BaseCadastroViagem;

