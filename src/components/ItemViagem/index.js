import { View, Text, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";

function ItemViagem(props) {

  const navigation = useNavigation();

  return(
    <View>
      <Pressable onPress={() => navigation.navigate(props.pagina)}>
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
      </Pressable>
    </View>
  )
}

export default ItemViagem;