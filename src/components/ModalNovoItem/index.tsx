import { Pressable, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { styles } from "./styles";

interface ModalNovoItemProps {
  closeModal: () => void;
}

function ModalNovoItem(props: ModalNovoItemProps) {
  return (
    <Pressable style={styles.background} onPress={props.closeModal}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Adicione um Novo Item</Text>
        </View>
        <TouchableOpacity style={styles.itemContainer}>
          <MaterialCommunityIcons name={'airplane'} size={40} color='#2b88d9'/>
          <Text style={styles.text}>Novo Transporte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
         <MaterialIcons name={'house'} size={40} color='#2b88d9'/>
          <Text style={styles.text}>Nova Hospedagem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <MaterialCommunityIcons name={'bus-side'} size={40} color='#2b88d9'/>
          <Text style={styles.text}>Novo Passeio Turístico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <FontAwesome6 name={'coins'} size={40} color='#2b88d9'/>
          <Text style={styles.text}>Nova Despesa</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

export default ModalNovoItem;