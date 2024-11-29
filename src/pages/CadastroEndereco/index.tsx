import { Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useState, useContext, useEffect } from "react";
import Header from "../../components/Header";
import Input from "../../components/InputCadastro";

import {styles} from './styles'
import Titulo from "../../components/Titulo";
import Botao from "../../components/Botao";
import { CadastroContext } from "../../contexts/cadastro";
import ModalErro from "../../components/ModalErro";
import { SafeAreaView } from "react-native-safe-area-context";
import {Picker} from '@react-native-picker/picker';
import ibgeApi from "../../services/api/ibge";
import viaCepApi from "../../services/api/viaCep";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootStackParamList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

function CadastroEndereco() {

  const [user, setUser] = useState({
    username: "",
    email: "",
    senha: "",
  });
  const [cep, setCep] = useState();
  const [enderecoApi, setEnderecoApi] = useState();
  const [bairro, setBairro] = useState();
  const [rua, setRua] = useState();
  const [numero, setNumero] = useState();
  const [complemento, setComlpemento] = useState();
  const [erroVazio, setErroVazio] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [erroEmail, setErroEmail] = useState(false);

  const [paisEscolhido, setPaisEscolhido] = useState();
  const [paises, setPaises] = useState([]);
  const [estadoEscolhido, setEstadoEscolhido] = useState();
  const [estados, setEstados] = useState([]);
  const [cidadeEscolhida, setCidadeEscolhida] = useState();
  const [cidades, setCidades] = useState([]);

  const { salvarDados } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
          navigation.navigate('Login');
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

  function limparEstados() {
    setEstados([])
    setEstadoEscolhido()
  }

  function limparCidades() {
    setCidades([])
    setCidadeEscolhida()
  }

  const buscarCep = async () => {
    try {
      const response = await viaCepApi.get(`/${cep}/json`);
      setEnderecoApi(response.data);
    } catch (err) {
      setEnderecoApi(null);
      alert(err + "Não foi encontrado endereço. Verifique o número de CEP informado")
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

  useEffect(() => {
    const consultaPaises = async () => {
      const response = await ibgeApi.get('/paises');
      setPaises(response.data)
    }
    consultaPaises();
  }, [])

  useEffect(() => {
    if(paisEscolhido === "Brasil") {
      const consultaEstados = async () => {
        const response = await ibgeApi.get('/estados');
        setEstados(response.data)
      }
      consultaEstados();
    }
  }, [paisEscolhido])

  useEffect(() => {
    if(paisEscolhido === "Brasil") {
      const consultaCidades = async () => {
        const response = await ibgeApi.get(`/estados/${estadoEscolhido}/municipios`);
        setCidades(response.data)
      }
      consultaCidades();
    }
  }, [estadoEscolhido])

  useEffect(() => {
    if(enderecoApi != null) {
      function atualizarCampos() {
        setPaisEscolhido("Brasil")
        setEstadoEscolhido(enderecoApi.uf)
        setCidadeEscolhida(enderecoApi.localidade)
        setBairro(enderecoApi.bairro)
        setRua(enderecoApi.logradouro)
      }
  
      atualizarCampos()
    }

  }, [enderecoApi])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Titulo texto="Cadastro" />
            <View style={styles.inputDuplo}>
              <Input
                label="CEP"
                placeholder="Digite seu CEP"
                onChangeText={setCep}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.botaoCEP} onPress={buscarCep}>
                <Ionicons name={'search'} size={25} color='#fff'/>
              </TouchableOpacity>
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.label}>Selecione o país</Text>
              <View style={styles.containerInput}>
                <Picker
                  selectedValue={paisEscolhido}
                  onValueChange={ (itemValue, itemIndex) => {
                    setPaisEscolhido(itemValue)
                    limparEstados()
                    limparCidades()
                  }}
                >
                  <Picker.Item label="Selecione o país" value="" />
                  {paises.map((item) => (
                    <Picker.Item key={item.id.M49} value={item.nome} label={item.nome} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.label}>Selecione o estado</Text>
              <View style={styles.containerInput}>
                <Picker
                  selectedValue={estadoEscolhido}
                  onValueChange={ (itemValue, itemIndex) => {
                    setEstadoEscolhido(itemValue)
                    limparCidades()
                  }}
                >
                  <Picker.Item label="Selecione o estado" value="" />
                  {estados.map((item) => (
                    <Picker.Item key={item.id} value={item.sigla} label={item.nome} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.label}>Selecione a cidade</Text>
              <View style={styles.containerInput}>
                <Picker
                  selectedValue={cidadeEscolhida}
                  onValueChange={ (itemValue, itemIndex) => setCidadeEscolhida(itemValue) }
                >
                  <Picker.Item label="Selecione a cidade" value="" />
                  {cidades.map((item) => (
                    <Picker.Item key={item.id} value={item.nome} label={item.nome} />
                  ))}
                </Picker>
              </View>
            </View>
            <Input
              label="Bairro"
              placeholder="Digite seu bairro"
              onChangeText={setBairro}
              value={bairro}
            />
            <Input
              label="Rua"
              placeholder="Digite a sua rua"
              onChangeText={setRua}
              value={rua}
            />
            <View style={styles.inputDuplo}>
              <Input
                label="Número"
                placeholder="Digite o Número"
                onChangeText={setNumero}
                value={numero}
              />
              <Input
                label="Complemento"
                placeholder="Complemento"
                onChangeText={setComlpemento}
                value={complemento}
              />
            </View>
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

export default CadastroEndereco;