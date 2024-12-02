import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from "./styles";
import HeaderFixo from "../../components/HeaderFixo";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { useRoute } from "@react-navigation/native";
import { formatDate } from "../../utils/DataFormat";

function ViagemSelecionada() {

  const route = useRoute();
  const { item } = route.params as { item: GetViagensResponseDto };

  return(
    <View style={styles.container}>
      <HeaderFixo />
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.noImage}>
            <FontAwesome6Icon name={'image'} size={40} color='#000' style={styles.icon}/>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name={'edit'} size={40} color='#000' style={styles.icon}/>
            </TouchableOpacity>
          </View>
          <View style={styles.headerContainer}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titulo}>{item.nome}</Text>
              <Text style={styles.data}>{formatDate(item.data_inicio)}</Text>
            </View>
            <Text style={styles.descricao}>{item.descricao}</Text>
          </View>
          <Text style={styles.titulo}>Destino</Text>
        </ScrollView>
        <Toast />
      </KeyboardAvoidingView>
    </View>
  )
}

export default ViagemSelecionada;