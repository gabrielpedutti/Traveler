import { View, Switch, Text, Pressable, Image } from 'react-native';
import { useState } from 'react';

import Input from '../../components/InputLogin';

import { styles } from './style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BotaoLoginExterno from '../../components/BotaoLoginExterno';
import { useNavigation } from '@react-navigation/native';

function Login() {

  const [username, setUsername] = useState();
  const [senha, setSenha] = useState();
  const [lembrar, setLembrar] = useState(false)

  const loginIcon = <FontAwesome name={'user'} size={25} color='#2c88d9'/>
  const senhaIcon = <FontAwesome name={'lock'} size={25} color='#2c88d9'/>
  const facebookIcon = <Ionicons name={'logo-facebook'} size={35} color='#fff'/>
  const googleIcon = <AntDesign name={'google'} size={35} color='#fff'/>
  const appleIcon = <AntDesign name={'apple1'} size={35} color='#fff'/>
  const linkedinIcon = <AntDesign name={'linkedin-square'} size={35} color='#fff'/>

  const navigation = useNavigation();


  function irCadastro(){
      navigation.navigate('Cadastro');
  }


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
          icon={loginIcon}
          onChangeText={() => setUsername()}
        />
        <Input 
          label="Senha"
          icon={senhaIcon}
          onChangeText={() => setSenha()}
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
      <Pressable 
        style={styles.botao}
        onPress={() => ''}
      >
        <Text style={styles.botaoText}>Entrar</Text>
      </Pressable>          
      <View style={styles.containerContinue}>
        <View style={styles.divisao}></View>
        <Text style={styles.textoBranco}>Continue com</Text>
        <View style={styles.divisao}></View>
      </View>
      <View style={styles.containerIcons}>
        <BotaoLoginExterno icone={facebookIcon}/>
        <BotaoLoginExterno icone={googleIcon}/>
        <BotaoLoginExterno icone={appleIcon}/>
        <BotaoLoginExterno icone={linkedinIcon}/>
      </View>
      <View style={styles.containerCadastre}>
        <Text style={styles.textoBranco}>Novo por aqui?</Text>
        <Pressable onPress={() => irCadastro()}>
          <Text style={styles.textoCadastre}>Cadastre sua conta!</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Login;