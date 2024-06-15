import { View, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";

function BotaoAdicionar() {

    const navigation = useNavigation();

  return(
    <TouchableOpacity style={styles.botaoMais} onPress={() => navigation.navigate('CadastroViagem')}>
        <Ionicons name={'add-circle-outline'} size={50} color='#2b88d9'/>
    </TouchableOpacity>
  )
}

export default BotaoAdicionar;