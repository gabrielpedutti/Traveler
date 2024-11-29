import { Image, Pressable, View } from "react-native";
import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

function HeaderFixo() {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return(
    <View style={styles.container}>
      <Pressable style={styles.voltar} onPress={() => navigation.navigate('MenuPrincipal')}>
        <Ionicons name={'menu'} size={40} color='#fff'/>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Image
          style={styles.imagem}
          source={require('../../assets/logo.png')}
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate('MenuPerfil')}>
        <FontAwesome style={styles.fotoPerfil} name={'user-circle-o'} size={40} color='#fff'/>
      </Pressable>
    </View>
  )
}

export default HeaderFixo;