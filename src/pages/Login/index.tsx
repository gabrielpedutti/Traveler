import { View, Switch, Text, Image, Touchable, TouchableOpacity } from 'react-native';
import { useState, useContext, useEffect } from 'react';

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

function Login(): JSX.Element {

  const [username, setUsername] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [lembrar, setLembrar] = useState<boolean>(false);
  const [erroLogin, setErroLogin] = useState<boolean>(false);

  const loginIcon = <FontAwesome name={'user'} size={25} color='#2c88d9'/>
  const senhaIcon = <FontAwesome name={'lock'} size={25} color='#2c88d9'/>
  const facebookIcon = <Ionicons name={'logo-facebook'} size={35} color='#fff'/>
  const googleIcon = <AntDesign name={'google'} size={35} color='#fff'/>
  const appleIcon = <AntDesign name={'apple1'} size={35} color='#fff'/>
  const linkedinIcon = <AntDesign name={'linkedin-square'} size={35} color='#fff'/>

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useContext(CadastroContext);

  function irCadastro(): void {
      navigation.navigate('Cadastro');
  }

  function logIn(): void {
    if(user.username == username && user.senha == senha) {
      navigation.navigate('Home');
    } else {
      setErroLogin(true)
    }
  }

  useEffect(() => {
    if(erroLogin) {
      setTimeout(() => {
        setErroLogin(false);
      }, 2000);
    }
  },[erroLogin])

  return(
    <View style={styles.container}>
      <View style={styles.containerImagem}>
        <Image
          style={styles.imagem}
          source={require('../../assets/logo.png')}
        />
      </View>
      <View>
        <Input 
          label="Login"
          placeholder="Digite seu usuário"
          icon={loginIcon}
          onChangeText={setUsername}
        />
        <Input 
          label="Senha"
          placeholder="Digite sua senha"
          icon={senhaIcon}
          onChangeText={setSenha}
          secureTextEntry={true}
        />
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
        onPress={() => logIn()}
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
      {erroLogin && <ModalErro titulo="Erro ao efetuar login" erro="Login ou Senha incorretos"/>}
    </View>
  )
}

export default Login;