import { Pressable, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

interface ModalNovoItemProps {
  closeModal: () => void;
  viagemId: number;
}

function ModalNovoItem(props: ModalNovoItemProps) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable style={styles.background} onPress={props.closeModal}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Adicione um Novo Item</Text>
        </View>
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("CadastroViagemNavigator", { screen: "CadastroTransporte", params: { isCreatingViagem: false } })}>
          <MaterialCommunityIcons name={'airplane'} size={40} color='#2b88d9'/>
          <Text style={styles.text}>Novo Transporte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("CadastroViagemNavigator", { screen: "CadastroHospedagem", params: { isCreatingViagem: false } })}>
         <MaterialIcons name={'house'} size={40} color='#2b88d9'/>
          <Text style={styles.text}>Nova Hospedagem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("CadastroViagemNavigator", { screen: "CadastroTurismo", params: { isCreatingViagem: false } })}>
          <MaterialCommunityIcons name={'bus-side'} size={40} color='#2b88d9'/>
          <Text style={styles.text}>Novo Passeio Turístico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("CadastroViagemNavigator", { screen: "CadastroTransporte", params: { isCreatingViagem: false } })}>
          <FontAwesome6 name={'coins'} size={40} color='#2b88d9'/>
          <Text style={styles.text}>Nova Despesa</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

export default ModalNovoItem;