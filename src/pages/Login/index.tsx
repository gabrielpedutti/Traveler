import { View, Switch, Text, Image, Touchable, TouchableOpacity } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import Input from '../../components/InputLogin';

import { styles } from './style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BotaoLoginExterno from '../../components/BotaoLoginExterno';
import { useNavigation } from '@react-navigation/native';
import ModalErro from '../../components/ModalErro';
import { CadastroContext } from '../../contexts/cadastro';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import travelerApi from '../../services/api/travelerApi';
import axios from 'axios';

async function salvarLogin(email: string, senha: string) {
  try {
    await AsyncStorage.setItem('@email', email); 
    await AsyncStorage.setItem('@senha', senha);
  } catch (e) {
    console.error("Erro ao salvar os dados de login", e);
  }
}

async function carregarLoginSalvo() {
  try {
    const emailSalvo = await AsyncStorage.getItem('@email');
    const senhaSalva = await AsyncStorage.getItem('@senha');

    if (emailSalvo !== null && senhaSalva !== null) {
      // Retorna os valores armazenados, ou usa um state para preencher automaticamente
      return { email: emailSalvo, senha: senhaSalva };
    } else {
      return { email: '', senha: '' };  // Retorna valores vazios caso não haja dados
    }
  } catch (e) {
    console.error("Erro ao carregar os dados de login", e);
    return { email: '', senha: '' };
  }
}

const loginSchema = z.object({
  email: z.string()
    .min(1, "Email é obrigatório")
    .refine((value) => value === '' || z.string().email().safeParse(value).success, {
      message: "Email inválido",
    }),
  senha: z.string().min(1, "Senha é obrigatória"),
});

interface LoginFormInputs {
  email: string;
  senha: string;
}

function Login(): JSX.Element {

  const [lembrar, setLembrar] = useState<boolean>(false);
  const [hasErroLogin, setHasErroLogin] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loginIcon = <FontAwesome name={'user'} size={25} color='#2c88d9'/>
  const senhaIcon = <FontAwesome name={'lock'} size={25} color='#2c88d9'/>
  const facebookIcon = <Ionicons name={'logo-facebook'} size={35} color='#fff'/>
  const googleIcon = <AntDesign name={'google'} size={35} color='#fff'/>
  const appleIcon = <AntDesign name={'apple1'} size={35} color='#fff'/>
  const linkedinIcon = <AntDesign name={'linkedin-square'} size={35} color='#fff'/>

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { salvarDados } = useContext(CadastroContext);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  function irCadastro(): void {
      navigation.navigate('Cadastro');
  }

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await travelerApi.post('/usuarios/login', data);
  
      if (response.data.success) {
        if (lembrar) {
          await salvarLogin(data.email, data.senha);
        }
        salvarDados(data)
        navigation.navigate('Home');
      } else {
        console.log(response.data.message);
        setHasErroLogin(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Erro ao fazer login:', error.response.data.message || 'Erro desconhecido');
          setError(error.response.data.message || 'Erro desconhecido');
        } else {
          console.error('Erro de rede ou no servidor:', error.message);
          setError('Erro de rede ou no servidor');
        }
      } else {
        console.error('Erro inesperado:', error);
        setError('Erro inesperado');
      }
      setHasErroLogin(true);
    }
  };
  
  useEffect(() => {
    if(hasErroLogin) {
      setTimeout(() => {
        setHasErroLogin(false);
      }, 2000);
    }
  },[hasErroLogin])

  useEffect(() => {
    const preencherLoginAutomatico = async () => {
      const loginSalvo = await carregarLoginSalvo();
      setValue('email', loginSalvo.email);
      setValue('senha', loginSalvo.senha);
      setLembrar(loginSalvo.email !== '' && loginSalvo.senha !== '');
    };

    preencherLoginAutomatico();
  }, [setValue]);

  return(
    <View style={styles.container}>
      <View style={styles.containerImagem}>
        <Image
          style={styles.imagem}
          source={require('../../assets/logo.png')}
        />
      </View>
      <View>
         <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Login"
              placeholder="Digite seu usuário"
              icon={loginIcon}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          name="email"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              icon={senhaIcon}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              secureTextEntry={true}
            />
          )}
          name="senha"
        />
        {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}
      </View>
      <View style={styles.containerLembrar}>
        <Switch
        style={styles.switch}
        value={lembrar}
        onValueChange={ (valorSwitch) => setLembrar(valorSwitch) }
        />
        <Text style={styles.textoBranco}>Lembrar</Text>
      </View>
      <TouchableOpacity 
        style={styles.botao}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.botaoText}>Entrar</Text>
      </TouchableOpacity>          
      <View style={styles.containerContinue}>
        <View style={styles.divisao}></View>
        <Text style={styles.textoBranco}>Continue com</Text>
        <View style={styles.divisao}></View>
      </View>
      <View style={styles.containerIcons}>
        <BotaoLoginExterno icone={facebookIcon} onPress={() => {}}/>
        <BotaoLoginExterno icone={googleIcon} onPress={() => {}}/>
        <BotaoLoginExterno icone={appleIcon} onPress={() => {}}/>
        <BotaoLoginExterno icone={linkedinIcon} onPress={() => {}}/>
      </View>
      <View style={styles.containerCadastre}>
        <Text style={styles.textoBranco}>Novo por aqui?</Text>
        <TouchableOpacity onPress={() => irCadastro()}>
          <Text style={styles.textoCadastre}>Cadastre sua conta!</Text>
        </TouchableOpacity>
      </View>
      {hasErroLogin && <ModalErro titulo="Erro ao efetuar login" erro={error}/>}
    </View>
  )
}

export default Login;