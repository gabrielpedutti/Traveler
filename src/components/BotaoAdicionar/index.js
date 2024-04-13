import { View, Pressable } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";

function BotaoAdicionar() {

    const navigation = useNavigation();

  return(
    <View style={styles.container}>
        <Pressable onPress={() => navigation.navigate('NovaViagem')}>
            <Ionicons name={'add-circle-outline'} size={40} color='#2b88d9'/>
        </Pressable>
    </View>
  )
}

export default BotaoAdicionar;