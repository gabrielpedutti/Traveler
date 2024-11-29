import { View, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

function BotaoAdicionar() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return(
    <TouchableOpacity style={styles.botaoMais} onPress={() => navigation.navigate('CadastroViagem')}>
        <Ionicons name={'add-circle-outline'} size={50} color='#2b88d9'/>
    </TouchableOpacity>
  )
}

export default BotaoAdicionar;