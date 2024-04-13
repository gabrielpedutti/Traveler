import { View, Text, Pressable } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";

function ItemMenu(props) {

  const navigation = useNavigation();

  return(

    <View style={styles.container}>
      <Ionicons name={props.name} size={35} color='#fff'/>
      <Pressable onPress={() => navigation.navigate(props.pagina)}>
        <Text style={styles.label}>{props.label}</Text>
      </Pressable>
    </View>
  )
}

export default ItemMenu;