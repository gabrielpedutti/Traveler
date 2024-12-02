import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

interface ItemViagemProps {
  imagem?: any;
  nome: string;
  descricao: string;
  destino: string;
  dataInicio: string;
  dataFim: string;
  statusViagem: string;
}

function ItemViagem(props: ItemViagemProps) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return(
    <TouchableOpacity style={styles.linha} onPress={() => {}}>
      <Image
        style={styles.img}
        source={props.imagem}
      />
      <View>
        <View >
          <View style={styles.container}>
              <View style={styles.primeiraLinha}>
              <Text style={styles.titulo}>{props.nome}</Text>
              <Text style={styles.tituloData}>{props.dataInicio}</Text>
            </View>
            <View style={styles.linha}>
              <Text style={styles.text}>{props.destino}:</Text>
              <Text style={styles.text}>{props.statusViagem}</Text>
            </View>
            <View style={styles.linha}>
              <Text style={styles.text}>{props.descricao}:</Text>
              <Text style={styles.text}>{props.dataFim}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ItemViagem;