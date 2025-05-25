import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { styles } from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { formatDate } from "../../utils/DataFormat";
import NoImage from "../NoImage";
import { useEffect, useState } from "react";
import travelerApi from "../../services/api/travelerApi";
import { set } from "zod";

interface ItemViagemProps {
  imagem?: any;
  item: GetViagensResponseDto;
}

function ItemViagem({item, imagem}: ItemViagemProps) {

  const [descricaoTruncada, setDescricaoTruncada] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return(
    <TouchableOpacity style={styles.wrapper} onPress={() => {navigation.navigate('ViagemSelecionada', {viagem: item})}}>
      {imagem == null ? 
      (<NoImage />)
      : 
      (<Image
        style={styles.img}
        source={imagem}
      />)
      }
      <View style={styles.container}>
        <View style={styles.linha}>
          <Text style={styles.titulo}>{item.nome}</Text>
          <Text style={styles.tituloData}>{formatDate(item.data_inicio)}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.text}></Text>
          <Text style={styles.text}>{item.status_viagem.descricao}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.text}>{item.viagem_destino.nm_municipio}</Text>
          <Text style={styles.text}>{formatDate(item.data_fim)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ItemViagem;