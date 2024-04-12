import { Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import { useState, useContext, useEffect } from "react";
import Header from "../../components/Header";
import Input from "../../components/InputCadastro";

import {styles} from './styles'
import Titulo from "../../components/Titulo";
import Botao from "../../components/Botao";
import { CadastroContext } from "../../contexts/cadastro";
import ErroCadastro from "../../components/ErroCadastro";

function Cadastro() {

  const [user, setUser] = useState({
    username: "",
    email: "",
    senha: "",
  });
  const [confirmaSenha, setConfirmaSenha] = useState();
  const [confirmaEmail, setConfirmaEmail] = useState();
  const [erroVazio, setErroVazio] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [erroEmail, setErroEmail] = useState(false);

  const { salvarDados } = useContext(CadastroContext);

  const handleInputChange = (fieldName, value) => {
    setUser(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

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
    }
  }

  useEffect(() => {
    if(erroVazio || erroSenha || erroEmail) {
      setTimeout(() => {
        setErroSenha(false);
        setErroEmail(false);
        setErroVazio(false);
      }, 2000);
    }
  },[erroVazio, erroSenha, erroEmail])

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
            onChangeText={(text) => handleInputChange("username", text)} 
          />
          <Input
            label="E-mail"
            onChangeText={(text) => handleInputChange("email", text)}
          />
          <Input
            label="Confirme o E-mail"
            onChangeText={setConfirmaEmail}
          />
          <Input
            label="Senha"
            onChangeText={(text) => handleInputChange("senha", text)}
            secureTextEntry={true}
          />
          <Input
            label="Confirme a Senha"
            onChangeText={setConfirmaSenha}
            secureTextEntry={true}
          />
          <Botao
            label="Cadastrar"
            onPress={cadastrar}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      {erroVazio && <ErroCadastro erro="Insira todos os Dados"/>}
      {erroEmail && <ErroCadastro erro="O E-mail e a confirmação do E-mail devem ser iguais!"/>}
      {erroSenha && <ErroCadastro erro="A senha e a confirmação de Senha devem ser iguais!"/>}
    </View>
  )
}

export default Cadastro;