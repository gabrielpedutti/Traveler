import { Image, Pressable, View } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './styles';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

interface HeaderProps {
  botaoFechar?: boolean;
}

function Header(props: HeaderProps) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [botaoFechar, setBotaoFechar] = useState(false);
  const [botaoVoltar, setBotaoVoltar] = useState(false);

  useEffect(() => {
    if(props.botaoFechar) {
      setBotaoFechar(true);
    } else {
      setBotaoVoltar(true);
    }
  },[]);
  
  return(
    <View style={styles.container}>
      <View style={styles.voltar}>
        {botaoVoltar && <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name={'chevron-back'} size={40} color='#fff'/>
        </Pressable>}
      </View>
      <Pressable>
        <Image
          style={styles.imagem}
          source={require('../../assets/logo.png')}
        />
      </Pressable>
      <View style={styles.fechar}>
        {botaoFechar && <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name={'close'} size={40} color='#fff'/>
        </Pressable>}
      </View>
    </View>
  )
}

export default Header;