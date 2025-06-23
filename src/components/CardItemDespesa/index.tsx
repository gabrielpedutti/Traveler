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
import CadastroDespesaResponseDto from "../../types/dto/CadastroDespesaResponseDto";
import GetViagemResponseDto from "../../types/dto/GetViagemResponseDto";

interface CardItemDespesaProps {
  imagem?: any;
  despesa: CadastroDespesaResponseDto;
  viagem: GetViagemResponseDto;
}

function CardItemDespesa({despesa, viagem, imagem}: CardItemDespesaProps) {

  const [descricaoTruncada, setDescricaoTruncada] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (despesa.descricao.length > 30) {
      setDescricaoTruncada(despesa.descricao.substring(0, 26) + '...');
    } else {
      setDescricaoTruncada(despesa.descricao);
    }
  }, [despesa.descricao]);

  return(
    <TouchableOpacity style={styles.wrapper} onPress={() => {navigation.navigate('Home')}}>
      <View style={styles.containerItem}>
        <FontAwesome6Icon name={'coins'} size={40} color='#2b88d9'/>
      </View>
      <View style={styles.container}>
        <View style={styles.linha}>
          <Text style={styles.titulo}>{descricaoTruncada}</Text>
          <Text style={styles.tituloData}>{formatDate(despesa.data)}</Text>
        </View>
        <View style={styles.linha}>

        </View>
        <View style={styles.linha}>
        <Text style={styles.text}>Valor: {formatarParaReal(despesa.valor)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CardItemDespesa;