import { View, Text, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import Toast from "react-native-toast-message";
import HeaderFixo from "../../components/HeaderFixo";
import { SafeAreaView } from "react-native-safe-area-context";
import Titulo from "../../components/Titulo";
import { formatDate } from "../../utils/DataFormat";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { formatarParaReal } from "../../utils/CurrencyFormat";
import BotaoSecundario from "../../components/BotaoSecundario";
import BotaoExcluir from "../../components/BotaoExcluir";
import { deleteLocalDocument, openLocalDocument } from "../../utils/fileUploadUtils";
import travelerApi from "../../services/api/travelerApi";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { useState } from "react";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import ModalConfirmacaoExcluir from "../../components/ModalConfirmacaoExcluir";
import GetPasseioResponseDto from "../../types/dto/GetPasseiosPorViagemDto"; // Certifique-se que este DTO corresponde aos dados do schema

function DetalhesPasseio({ route }: any) {
  const { passeio } = route.params as { passeio: GetPasseioResponseDto };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isConfirmandoExcluir, setIsConfirmandoExcluir] = useState(false);

  const getIconePorTipoPasseio = (tipoDescricao: string) => {
    switch (tipoDescricao.toLowerCase()) {
      case "city tour":
        return "city";
      case "festival/evento":
        return "calendar-star"; // Considere alternativas se FA5 Pro não estiver disponível: 'calendar-alt', 'glass-cheers'
      case "mergulho/snorkeling":
        return "swimmer"; // 'water' também é uma opção
      case "montanha/trilha":
        return "hiking";
      case "museu":
        return "landmark"; // 'monument' ou 'building-columns' (FontAwesome 6)
      case "parque natural":
        return "tree";
      case "parque temático":
        return "fort-awesome"; // Ou 'laugh-beam'
      case "passeio de barco":
        return "ship";
      case "passeio ecológico":
        return "leaf";
      case "safari":
        return "binoculars"; // Outras opções: 'hippo' (FontAwesome 6), 'paw'
      case "show/espetáculo":
        return "theater-masks"; // 'music', 'microphone'
      case "tour cultural":
        return "palette";
      case "tour de bicicleta":
        return "bicycle";
      case "tour fotográfico":
        return "camera-retro";
      case "tour gastronômico":
        return "utensils";
      case "tour histórico":
        return "book-reader"; // 'landmark', 'scroll'
      case "tour religioso":
        return "church"; // 'pray', 'cross', 'kaaba'
      case "vinícola/degustação":
        return "wine-glass-alt";
      default:
        return "map-marked-alt";
    }
  };

  const handleOpenDocument = async () => {
    if (passeio.documento_anexo) {
      await openLocalDocument(passeio.documento_anexo);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Sem anexo',
        text2: 'Nenhum documento anexado a este passeio.',
        visibilityTime: 3000,
      });
    }
  };

  async function excluirPasseio() {
    const currentDocumentPath = passeio.documento_anexo;
    if (currentDocumentPath) {
      await deleteLocalDocument(currentDocumentPath);
    }

    let viagemParaNavegar: GetViagensResponseDto | null = null;

    try {
      const responseViagem = await travelerApi.get(`/viagem/${passeio.viagem_id}`);
      viagemParaNavegar = responseViagem.data;
    } catch (error) {
      console.error("Erro ao buscar dados da viagem antes de excluir passeio:", error);
    }

    try {
      await travelerApi.delete(`/passeio/${passeio.id}/delete`);

      if (viagemParaNavegar) {
        navigation.navigate('ViagemSelecionada', { viagem: viagemParaNavegar });
      } else {
        navigation.navigate('Viagens');
      }
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Passeio excluído com sucesso.',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Erro ao excluir passeio:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao excluir passeio.',
        visibilityTime: 3000,
      });
    }
  }

  function handleExcluirPasseio() {
    setIsConfirmandoExcluir(true);
  }

  function handleConfirmarExcluir() {
    excluirPasseio().then(() => {
      setIsConfirmandoExcluir(false);
    });
  }

  function handleCancelarExcluir() {
    setIsConfirmandoExcluir(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderFixo />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Titulo texto="Passeio Turístico" />
            <View style={styles.cardPontilhadoContainer}>
              <View style={styles.cardPontilhadoCima}>
                <View style={styles.wrapperInfos}>
                  <FontAwesome5Icon
                    name={getIconePorTipoPasseio(passeio.tipo_passeio.descricao)}
                    size={24} // Ajuste o tamanho conforme necessário
                    color='#2b88d9'
                    style={styles.dateIcons} // Adicione este estilo em styles.ts
                  />
                  <Text style={styles.textoHospedagem}>{passeio.nome}</Text>
                </View>
                <View style={styles.containerInfos}>
                  <Text style={styles.textoHospedagem}>Tipo: </Text>
                  <Text style={styles.dadosHospedagem}>{passeio.tipo_passeio.descricao}</Text>
                </View>
              </View>
              <View style={styles.dottedLine} />
              <View style={styles.cardPontilhadoBaixo}>
                <View style={styles.containerInfos}>
                  <View style={styles.containerData}>
                    <Text style={styles.textCheckInOut}>Data do Passeio</Text>
                    <View style={styles.containerDataIcone}>
                      <FontAwesome5Icon name={'calendar-alt'} size={30} color='#2b88d9' style={styles.dateIcons} />
                      <Text style={styles.dateText}>{formatDate(passeio.data)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <Titulo texto="Anexo" />
            <View style={styles.card}>
              <TouchableOpacity style={styles.containerInfos} onPress={handleOpenDocument}>
                <MaterialCommunityIcons name={'file-document'} size={30} color='#2b88d9' />
                {passeio.documento_anexo ? (
                  <Text style={styles.textoHospedagem}>{passeio.documento_anexo.split('/').pop()}</Text>
                ) : (
                  <Text style={styles.textoHospedagem}>Nenhum documento anexado</Text>
                )}
              </TouchableOpacity>
            </View>

            <Titulo texto="Despesa" />
            <View style={styles.card}>
              <View style={styles.containerInfos}>
                <Text style={styles.textoHospedagem}>Valor: </Text>
                <Text style={styles.dadosHospedagem}>{formatarParaReal(passeio.despesa.valor)}</Text>
              </View>
            </View>

            <View style={styles.containerBotoes}>
              <BotaoSecundario label={<MaterialIcons name={'edit'} size={22} color='#2b88d9' />} onPress={() => {}} />
              <BotaoExcluir onPress={handleExcluirPasseio} />
            </View>
          </ScrollView>
          <Toast />
          {isConfirmandoExcluir && (
            <ModalConfirmacaoExcluir onPressExcluir={handleConfirmarExcluir} onPressCancelar={handleCancelarExcluir} />
          )}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

export default DetalhesPasseio;