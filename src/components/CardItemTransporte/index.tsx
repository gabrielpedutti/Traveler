import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { formatDate } from "../../utils/DataFormat";
import NoImage from "../NoImage";
import { useEffect, useState } from "react";
import travelerApi from "../../services/api/travelerApi";
import { set } from "zod";
import { styles } from "./styles";
import { formatarParaReal } from "../../utils/CurrencyFormat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GetTransportesPorViagemDto from "../../types/dto/GetTransportesPorViagemDto";

interface CardItemTransporteProps {
  imagem?: any;
  item: GetTransportesPorViagemDto;
}

function CardItemTransporte({item, imagem}: CardItemTransporteProps) {

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
      <MaterialCommunityIcons name={'bus-side'} size={40} color='#2b88d9'/>
      </View>
      <View style={styles.container}>
        <View style={styles.linha}>
          <Text style={styles.titulo}>{nomeTruncado}</Text>
          <Text style={styles.tituloData}>{formatDate(item.data)}</Text>
        </View>
        <View style={styles.linha}>

        </View>
        <View style={styles.linha}>
        <Text style={styles.text}>Destino: {item.transporte_destino_id}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CardItemTransporte;