import { Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import Header from "../../components/Header";
import Input from "../../components/InputCadastro";

import {styles} from './styles'
import Titulo from "../../components/Titulo";
import Botao from "../../components/Botao";

function Cadastro() {
  return(
    <View>
      <Header />
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <Titulo
            texto="Cadastro"
          />
          <Input
            label="Username"
            onChangeText={() => ''}
          />
          <Input
            label="E-mail"
            onChangeText={() => ''}
          />
          <Input
            label="Confirme o E-mail"
            onChangeText={() => ''}
          />
          <Input
            label="Senha"
            onChangeText={() => ''}
            secureTextEntry={true}
          />
          <Input
            label="Confirme a Senha"
            onChangeText={() => ''}
            secureTextEntry={true}
          />
          <Botao
            label="Continuar"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Cadastro;