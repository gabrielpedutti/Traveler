import { Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useContext, useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import Toast from 'react-native-toast-message';

import Header from "../../components/Header";
import Input from "../../components/InputCadastro";
import {styles} from './styles'
import Titulo from "../../components/Titulo";
import Botao from "../../components/Botao";
import { CadastroContext } from "../../contexts/cadastro";
import ModalErro from "../../components/ModalErro";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { CadastroRequestDto } from "../../types/dto/CadastroRequestDto";
import { DateInput } from "../../components/DateInput";
import travelerApi from "../../services/api/travelerApi";
import { PaisResponseDto } from "../../types/dto/PaisResponseDto";
import { EstadoResponseDto } from "../../types/dto/EstadoResponseDto";
import { MunicipioResponseDto } from "../../types/dto/MunicipioResponseDto";
import { cadastrarUsuario } from "../../services/httpService";
import { formatToISOString } from "../../utils/DataFormat";
import { ErroResponseDto } from "../../types/dto/ErroResponseDto";
import SelecionarPaisEstadoCidade from "../../components/SelecionarPaisEstadoCidade";

const CadastroSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  data_nascimento: z.string().min(1, "Data de Nascimento é obrigatória"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
  municipio_id: z
  .union([z.string(), z.number()]) // Aceita tanto string quanto número
  .refine((val) => !isNaN(Number(val)), { message: "Origem é obrigatório" }) // Verifica se é um número válido
  .transform((val) => {
    // Se for string (iOS), converte para número, se já for número (Android), deixa como está
    return Platform.OS === 'ios' ? Number(val) : val;
  })
  .refine((val) => Number(val) > 0, { message: "Origem é obrigatório" }),
});

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
  const [paisEscolhido, setPaisEscolhido] = useState<string>('');
  const [paises, setPaises] = useState<PaisResponseDto[]>([]);
  const [estadoEscolhido, setEstadoEscolhido] = useState<string>('');
  const [estados, setEstados] = useState<EstadoResponseDto[]>([]);
  const [cidades, setCidades] = useState<MunicipioResponseDto[]>([]);

  const { salvarDados } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { control, handleSubmit, formState: { errors } } = useForm<CadastroRequestDto>({
    resolver: zodResolver(CadastroSchema),
    defaultValues: {
      nome: '',
      data_nascimento: '',
      email: '',
      senha: '',
      municipio_id: 0,
      tipo_usuario_id: 1,
      tipo_cadastro_id: 1
    }
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setUser(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  function irCadastroEndereco(){
    navigation.navigate('CadastroEndereco');
  }

  function limparEstados() {
    setEstados([])
    setEstadoEscolhido('')
  }

  function limparCidades() {
    setCidades([])
  }

  async function cadastrar(data: CadastroRequestDto) {
    
    const dataFormatada = formatToISOString(data.data_nascimento);
    const payload = {
      ...data,
      data_nascimento: dataFormatada,
      municipio_id: Number(data.municipio_id),
      tipo_usuario_id: 2, //1-Administrador, 2-Usuário
      tipo_cadastro_id: 1
    }
  
    try {
      const response = await cadastrarUsuario(payload);
      console.log("Response recebida:");
      console.log(response);

      Toast.show({
        type: "success",
        text1: 'Cadastro realizado com sucesso',
        text2: 'Seja bem-vindo ao Traveler!',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 130,
        position: 'top',
        text1Style: {
          fontSize: 16, // Aumenta o tamanho da fonte para o texto principal
          fontWeight: 'bold', // Torna o texto principal em negrito
        },
        text2Style: {
          fontSize: 16, // Aumenta o tamanho da fonte para o texto secundário
        },
        onPress: () => {
          Toast.hide();
        }
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 1000);

    // Verifique se a resposta é do tipo erro
    if ((response as ErroResponseDto).status) {
      // Aqui sabemos que o response é do tipo ErroResponseDto
      throw response;
    }
  
    } catch (error) {
      // Verifique se o erro é uma instância de ErroResponseDto
      const err = error as ErroResponseDto;
  
      // Mensagem de erro com Toast
      Toast.show({
        type: "error",
        text1: 'Ocorreu um erro ao cadastrar',
        text2: err.message || 'Erro desconhecido', // Acesse a mensagem diretamente
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 130,
        position: 'top',
        text1Style: {
          fontSize: 16, // Aumenta o tamanho da fonte para o texto principal
          fontWeight: 'bold', // Torna o texto principal em negrito
        },
        text2Style: {
          fontSize: 16, // Aumenta o tamanho da fonte para o texto secundário
        },
        onPress: () => {
          Toast.hide();
        }
      });
    }
    
    // if(user.username !== "" && user.email !== "" && user.senha !== "") {
    //   if(user.email == confirmaEmail) {
    //     if(user.senha == confirmaSenha) {
    //       salvarDados(user);
    //     } else {
    //       setErroSenha(true);
    //     }
    //   } else {
    //     setErroEmail(true); 
    //   }
    // } else {
    //   setErroVazio(true);
    // }
  }

  useEffect(() => {
    const consultaPaises = async () => {
      const response = await travelerApi.get('/locations/paises');
      setPaises(response.data)
    }
    consultaPaises();
  }, [])

  useEffect(() => {
    const consultaEstados = async () => {
      const response = await travelerApi.get(`/locations/estados?idPais=${paisEscolhido}`);
      setEstados(response.data)
    }
    consultaEstados();
  }, [paisEscolhido])

  useEffect(() => {
    const consultaCidades = async () => {
      const response = await travelerApi.get(`/locations/municipios?idEstado=${estadoEscolhido}`);
      setCidades(response.data)
    }
    consultaCidades();
  }, [estadoEscolhido])

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

            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome"
                  placeholder="Digite o nome de usuário"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.nome && <Text style={styles.error} >{errors.nome.message}</Text>}

            <Controller
              control={control}
              name="data_nascimento"
              render={({ field: { onChange, onBlur, value } }) => (
                <DateInput
                  label="Data de Nascimento"
                  placeholder="Data de Nascimento"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.data_nascimento && <Text style={styles.error} >{errors.data_nascimento.message}</Text>}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  placeholder="Digite seu E-mail"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.email && <Text style={styles.error} >{errors.email.message}</Text>}

            <Input
              label="Confirme o E-mail"
              placeholder="Confirme seu E-mail"
              keyboardType="email-address"
              onChangeText={setConfirmaEmail}
              value={confirmaEmail}
            />

            <Controller
              control={control}
              name="senha"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  placeholder="Digite sua senha"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={true}
                />
              )}
            />
            {errors.senha && <Text style={styles.error} >{errors.senha.message}</Text>}

            <Input
              label="Confirme a Senha"
              placeholder="Confirme sua senha"
              onChangeText={setConfirmaSenha}
              secureTextEntry={true}
              value={confirmaSenha}
            />
            <SelecionarPaisEstadoCidade municipioName={"municipio_id"} control={control} errors={errors} />
            {errors.tipo_cadastro_id && <Text style={styles.error} >{errors.tipo_cadastro_id.message}</Text>}
            {errors.tipo_usuario_id && <Text style={styles.error} >{errors.tipo_usuario_id.message}</Text>}

            <Botao label="Cadastrar" onPress={handleSubmit(cadastrar)} />
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
      <Toast />
    </SafeAreaView>
  );
}

export default Cadastro;