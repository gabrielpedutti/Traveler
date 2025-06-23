import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { formatDate } from "../../utils/DataFormat";
import { useEffect, useState } from "react";
import { styles } from "./styles"; // Você precisará criar este arquivo ou adaptar um existente
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import GetPasseioResponseDto from "../../types/dto/GetPasseiosPorViagemDto"; // Ou o DTO específico se for diferente para o item do card
import { formatarParaReal } from "../../utils/CurrencyFormat";
import GetViagemResponseDto from "../../types/dto/GetViagemResponseDto";

interface CardItemPasseioProps {
  passeio: GetPasseioResponseDto; // Ajuste este tipo se necessário
  viagem: GetViagemResponseDto;
  // imagem?: any; // Removido se não estiver usando
}

const getIconePorTipoPasseioCard = (tipoDescricao: string) => {
  switch (tipoDescricao.toLowerCase()) {
    case "city tour":
      return "city";
    case "festival/evento":
      return "calendar-star";
    case "mergulho/snorkeling":
      return "swimmer";
    case "montanha/trilha":
      return "hiking";
    case "museu":
      return "landmark";
    case "parque natural":
      return "tree";
    case "parque temático":
      return "fort-awesome";
    case "passeio de barco":
      return "ship";
    case "passeio ecológico":
      return "leaf";
    case "safari":
      return "binoculars";
    case "show/espetáculo":
      return "theater-masks";
    case "tour cultural":
      return "palette";
    case "tour de bicicleta":
      return "bicycle";
    case "tour fotográfico":
      return "camera-retro";
    case "tour gastronômico":
      return "utensils";
    case "tour histórico":
      return "book-reader";
    case "tour religioso":
      return "church";
    case "vinícola/degustação":
      return "wine-glass-alt";
    default:
      return "map-marked-alt";
  }
};

function CardItemPasseio({ passeio, viagem }: CardItemPasseioProps) {
  const [nomeTruncado, setNomeTruncado] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (passeio.nome && passeio.nome.length > 30) {
      setNomeTruncado(passeio.nome.substring(0, 26) + '...');
    } else {
      setNomeTruncado(passeio.nome || '');
    }
  }, [passeio.nome]);

  // Verificações para garantir que tipo_passeio e despesa existem antes de acessá-los
  const tipoDescricao = passeio.tipo_passeio?.descricao || "Tipo não definido";
  const valorDespesa = passeio.despesa?.valor !== undefined ? formatarParaReal(passeio.despesa.valor) : "Valor não definido";

  const nomeIcone = getIconePorTipoPasseioCard(tipoDescricao);

  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => { navigation.navigate('DetalhesPasseio', { passeio: passeio, viagem: viagem }) }}>
      <View style={styles.containerItem}>
        <FontAwesome5Icon name={nomeIcone} size={40} color='#2b88d9' />
      </View>
      <View style={styles.container}>
        <View style={styles.linha}>
          <Text style={styles.titulo}>{nomeTruncado}</Text>
          <Text style={styles.tituloData}>{formatDate(passeio.data)}</Text>
        </View>
        <View style={styles.linha}>
          {/* Pode adicionar outra informação aqui se desejar, como o tipo do passeio */}
          <Text style={styles.text}>Tipo: {tipoDescricao}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.text}>Valor: {valorDespesa}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CardItemPasseio;