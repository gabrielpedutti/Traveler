import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { formatDate } from "../../utils/DataFormat";
import { useEffect, useState } from "react";
import { styles } from "./styles";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"; // Alterado para FontAwesome5Icon
import GetTransporteResponseDto from "../../types/dto/GetTransportePorViagemDto";
import GetViagemResponseDto from "../../types/dto/GetViagemResponseDto";

interface CardItemTransporteProps {
  imagem?: any;
  transporte: GetTransporteResponseDto;
  viagem: GetViagemResponseDto;
}

const getIconePorTipoTransporteCard = (tipoDescricao: string) => {
  switch (tipoDescricao.toLowerCase()) {
    case "aplicativo de transporte":
      return "car-side";
    case "avião":
      return "plane";
    case "barco/ferry":
      return "ship";
    case "bicicleta":
      return "bicycle";
    case "carro alugado":
      return "car-alt";
    case "cruzeiro":
      return "ship";
    case "helicóptero":
      return "helicopter";
    case "metrô":
      return "subway";
    case "moto":
      return "motorcycle";
    case "moto-táxi":
      return "motorcycle";
    case "ônibus":
      return "bus-alt";
    case "táxi":
      return "taxi";
    case "trem":
      return "train";
    case "van/shuttle":
      return "shuttle-van";
    case "veículo próprio":
      return "car";
    default:
      return "bus-alt"; // Ícone padrão para FontAwesome5, similar ao de ônibus
  }
};

function CardItemTransporte({transporte, viagem, imagem}: CardItemTransporteProps) {
  const [nomeTruncado, setNomeTruncado] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (transporte.nome.length > 30) {
      setNomeTruncado(transporte.nome.substring(0, 26) + '...');
    } else {
      setNomeTruncado(transporte.nome);
    }
  }, [transporte.nome]);

  const nomeIcone = getIconePorTipoTransporteCard(transporte.tipo_transporte.descricao);

  return(
    <TouchableOpacity style={styles.wrapper} onPress={() => {navigation.navigate('DetalhesTransporte', {transporte: transporte, viagem: viagem})}}>
      <View style={styles.containerItem}>
        <FontAwesome5Icon name={nomeIcone} size={40} color='#2b88d9'/>
      </View>
      <View style={styles.container}>
        <View style={styles.linha}>
          <Text style={styles.titulo}>{nomeTruncado}</Text>
          <Text style={styles.tituloData}>{formatDate(transporte.data)}</Text>
        </View>
        <View style={styles.linha}>
        </View>
        <View style={styles.linha}>
          <Text style={styles.text}>Destino: {transporte.transporte_destino.nm_municipio}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CardItemTransporte;