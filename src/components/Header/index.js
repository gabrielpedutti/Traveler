import { Image, Pressable, View } from "react-native";
import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './styles';

function Header() {

  const navigation = useNavigation();
  
  return(
    <View style={styles.container}>
      <Pressable style={styles.voltar}  onPress={() => navigation.goBack()}>
        <Ionicons name={'chevron-back'} size={40} color='#fff'/>
      </Pressable>
      <Pressable>
        <Image
          style={styles.imagem}
          source={require('../../assets/logo.png')}
        />
      </Pressable>
    </View>
  )
}

export default Header;