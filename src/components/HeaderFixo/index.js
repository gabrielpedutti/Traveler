import { Image, Pressable, View } from "react-native";
import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';

function HeaderFixo() {

  const navigation = useNavigation();
  
  return(
    <View style={styles.container}>
      <Pressable style={styles.voltar}  onPress={() => navigation.goBack()}>
        <Ionicons name={'menu'} size={40} color='#fff'/>
      </Pressable>
      <Pressable>
        <Image
          style={styles.imagem}
          source={require('../../assets/logo.png')}
        />
      </Pressable>
      <Pressable>
        <FontAwesome style={styles.fotoPerfil} name={'user-circle-o'} size={40} color='#fff'/>
      </Pressable>
    </View>
  )
}

export default HeaderFixo;