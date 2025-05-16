import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { formatDate } from "../../utils/DataFormat";
import { useEffect, useState } from "react";
import { styles } from "./styles";
import { formatarParaReal } from "../../utils/CurrencyFormat";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import GetPasseiosPorViagemDto from "../../types/dto/GetPasseiosPorViagemDto";

interface CardItemPasseioProps {
  imagem?: any;
  item: GetPasseiosPorViagemDto;
}

function CardItemPasseio({item, imagem}: CardItemPasseioProps) {

  const [nomeTruncado, setNomeTruncado] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (item.nome.length > 30) {
      setNomeTruncado(item.nome.substring(0, 26) + '...');
    } else {
      setNomeTruncado(item.nome);
    }
  }, [item.nome]);

  return(
    <TouchableOpacity style={styles.wrapper} onPress={() => {navigation.navigate('Home')}}>
      <View style={styles.containerItem}>
        <FontAwesome6Icon name={'bus-side'} size={40} color='#2b88d9'/>
      </View>
      <View style={styles.container}>
        <View style={styles.linha}>
          <Text style={styles.titulo}>{nomeTruncado}</Text>
          <Text style={styles.tituloData}>{formatDate(item.data)}</Text>
        </View>
        <View style={styles.linha}>

        </View>
        <View style={styles.linha}>
        <Text style={styles.text}>Valor: {formatarParaReal(item.valor)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CardItemPasseio;