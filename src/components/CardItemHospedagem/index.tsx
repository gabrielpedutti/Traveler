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
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import GetHospedagemResponseDto from "../../types/dto/GetHospedagemPorViagemDto";

interface CardItemHospedagemProps {
  imagem?: any;
  item: GetHospedagemResponseDto;
}

function CardItemHospedagem({item, imagem}: CardItemHospedagemProps) {

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
    <TouchableOpacity style={styles.wrapper} onPress={() => {navigation.navigate('DetalhesHospedagem', {hospedagem: item})}}>
      <View style={styles.containerItem}>
        <FontAwesome6Icon name={'house'} size={40} color='#2b88d9'/>
      </View>
      <View style={styles.container}>
        <View style={styles.linha}>
          <Text style={styles.titulo}>{nomeTruncado}</Text>
          <Text style={styles.tituloData}>{formatDate(item.data_checkin)}</Text>
        </View>
        <View style={styles.linha}>

        </View>
        <View style={styles.linha}>
        <Text style={styles.text}>Valor: {formatarParaReal(item.despesa.valor)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CardItemHospedagem;