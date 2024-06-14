import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";

function ItemViagem(props) {

  const navigation = useNavigation();

  return(
    <TouchableOpacity style={styles.linha} onPress={() => navigation.navigate(props.pagina)}>
      <Image
        style={styles.img}
        source={props.imagem}
      />
      <View>
        <View >
          <View style={styles.container}>
              <View style={styles.primeiraLinha}>
              <Text style={styles.titulo}>{props.destino}</Text>
              <Text style={styles.tituloData}>{props.data}</Text>
            </View>
            <View style={styles.linha}>
              <Text style={styles.text}>{props.tipoTransporte}:</Text>
              <Text style={styles.text}>{props.numeroBilhete}</Text>
            </View>
            <View style={styles.linha}>
              <Text style={styles.text}>{props.tipoHospedagem}:</Text>
              <Text style={styles.text}>{props.nomeHospedagem}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ItemViagem;