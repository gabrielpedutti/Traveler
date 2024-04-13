import { Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import { useState, useContext, useEffect } from "react";
import Header from "../../components/Header";
import Input from "../../components/InputCadastro";

import {styles} from './styles'
import Titulo from "../../components/Titulo";
import Botao from "../../components/Botao";
import { CadastroContext } from "../../contexts/cadastro";
import ModalErro from "../../components/ModalErro";

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
            placeholder="Digite o nome de usuário"
            onChangeText={(text) => handleInputChange("username", text)} 
          />
          <Input
            label="E-mail"
            placeholder="Digite seu E-mail"
            onChangeText={(text) => handleInputChange("email", text)}
          />
          <Input
            label="Confirme o E-mail"
            placeholder="Confirme seu E-mail"
            onChangeText={setConfirmaEmail}
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha"
            onChangeText={(text) => handleInputChange("senha", text)}
            secureTextEntry={true}
          />
          <Input
            label="Confirme a Senha"
            placeholder="Confirme sua senha"
            onChangeText={setConfirmaSenha}
            secureTextEntry={true}
          />
          <Botao
            label="Cadastrar"
            onPress={cadastrar}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      {erroVazio && <ModalErro titulo="Erro ao Cadastrar" erro="Insira todos os Dados"/>}
      {erroEmail && <ModalErro titulo="Erro ao Cadastrar" erro="O E-mail e a confirmação do E-mail devem ser iguais!"/>}
      {erroSenha && <ModalErro titulo="Erro ao Cadastrar" erro="A senha e a confirmação de Senha devem ser iguais!"/>}
    </View>
  )
}

export default Cadastro;