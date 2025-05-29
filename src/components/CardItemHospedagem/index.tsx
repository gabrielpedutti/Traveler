import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { formatDate } from "../../utils/DataFormat";
import { useEffect, useState } from "react";
import { styles } from "./styles";
import { formatarParaReal } from "../../utils/CurrencyFormat";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"; // Alterado para FontAwesome5Icon
import GetHospedagemResponseDto from "../../types/dto/GetHospedagemPorViagemDto";

interface CardItemHospedagemProps {
  imagem?: any;
  item: GetHospedagemResponseDto;
}

const getIconePorTipoHospedagemCard = (tipoDescricao: string) => {
  switch (tipoDescricao.toLowerCase()) {
    case "airbnb":
      return "house-user";
    case "apartamento/casa alugada":
      return "home";
    case "camping":
      return "campground";
    case "casa de amigos/familiares":
      return "users";
    case "chalé":
      return "mountain"; // Ícone genérico, pode precisar de um mais específico se disponível
    case "flat/apart-hotel":
      return "building";
    case "homestay/couchsurfing":
      return "couch";
    case "hostel":
      return "bed"; // Pode ser usado para hostel também
    case "hotel":
      return "hotel";
    case "hotel-fazenda":
      return "tractor"; // Ícone genérico, pode precisar de um mais específico
    case "pousada":
      return "concierge-bell";
    case "resort":
      return "umbrella-beach";
    case "spa":
      return "spa";
    default:
      return "hotel"; // Ícone padrão
  }
};

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

  const nomeIcone = getIconePorTipoHospedagemCard(item.tipo_hospedagem.descricao);

  return(
    <TouchableOpacity style={styles.wrapper} onPress={() => {navigation.navigate('DetalhesHospedagem', {hospedagem: item})}}>
      <View style={styles.containerItem}>
        <FontAwesome5Icon name={nomeIcone} size={40} color='#2b88d9'/>
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