import { View, TouchableOpacity } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

function BotaoAdicionar() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return(
    <TouchableOpacity style={styles.botaoMais} onPress={() => navigation.navigate("CadastroViagem")}>
      <AntDesign name={'plus'} size={35} color='#fff'/>
    </TouchableOpacity>
  )
}

export default BotaoAdicionar;