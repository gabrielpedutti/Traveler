import { View, Text, Pressable, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

interface ItemMenuProps {
  label: string;
  name: string;
  pagina: keyof RootStackParamList;
}

function ItemMenu(props: ItemMenuProps) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return(

    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate(props.pagina)}>
      <Ionicons name={props.name} size={35} color='#fff'/>
      <Text style={styles.label}>{props.label}</Text>
    </TouchableOpacity>
  )
}

export default ItemMenu;