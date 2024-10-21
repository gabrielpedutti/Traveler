import { Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import { useState, useContext, useEffect } from "react";
import Header from "../../components/Header";
import Input from "../../components/InputCadastro";

import {styles} from './styles'
import Titulo from "../../components/Titulo";
import Botao from "../../components/Botao";
import { CadastroContext } from "../../contexts/cadastro";
import ModalErro from "../../components/ModalErro";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

function Cadastro(): JSX.Element {

  const [user, setUser] = useState({
    username: "",
    email: "",
    senha: "",
  });
  const [confirmaSenha, setConfirmaSenha] = useState<string>('');
  const [confirmaEmail, setConfirmaEmail] = useState<string>('');
  const [erroVazio, setErroVazio] = useState<boolean>(false);
  const [erroSenha, setErroSenha] = useState<boolean>(false);
  const [erroEmail, setErroEmail] = useState<boolean>(false);

  const { salvarDados } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleInputChange = (fieldName: string, value: string) => {
    setUser(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  function irCadastroEndereco(){
    navigation.navigate('CadastroEndereco');
}

  function cadastrar() {
    if(user.username !== "" && user.email !== "" && user.senha !== "") {
      if(user.email == confirmaEmail) {
        if(user.senha == confirmaSenha) {
          salvarDados(user);
        } else {
          setErroSenha(true);
        }
      } else {
        setErroEmail(true); 
      }
    } else {
      setErroVazio(true);
      // irCadastroEndereco()
      // enviarCadastro()

    }
  }
  
  // function enviarCadastro () {
  //   axios.post('API_URL', user)
  //   .then()
  // }

  // useEffect(() => enviarCadastro, [])

  useEffect(() => {
    if(erroVazio || erroSenha || erroEmail) {
      setTimeout(() => {
        setErroSenha(false);
        setErroEmail(false);
        setErroVazio(false);
      }, 2000);
    }
  },[erroVazio, erroSenha, erroEmail])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Titulo texto="Cadastro" />
            <Input
              label="Username"
              placeholder="Digite o nome de usuário"
              onChangeText={(text: string) => handleInputChange("username", text)}
            />
            <Input
              label="E-mail"
              placeholder="Digite seu E-mail"
              onChangeText={(text: string) => handleInputChange("email", text)}
            />
            <Input
              label="Confirme o E-mail"
              placeholder="Confirme seu E-mail"
              onChangeText={setConfirmaEmail}
            />
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              onChangeText={(text: string) => handleInputChange("senha", text)}
              secureTextEntry={true}
            />
            <Input
              label="Confirme a Senha"
              placeholder="Confirme sua senha"
              onChangeText={setConfirmaSenha}
              secureTextEntry={true}
            />
            <Botao label="Cadastrar" onPress={cadastrar} />
          </ScrollView>
        </KeyboardAvoidingView>
        {erroVazio && (
          <ModalErro titulo="Erro ao Cadastrar" erro="Insira todos os Dados" />
        )}
        {erroEmail && (
          <ModalErro titulo="Erro ao Cadastrar" erro="O E-mail e a confirmação do E-mail devem ser iguais!" />
        )}
        {erroSenha && (
          <ModalErro titulo="Erro ao Cadastrar" erro="A senha e a confirmação de Senha devem ser iguais!" />
        )}
      </View>
    </SafeAreaView>
  );
}

export default Cadastro;