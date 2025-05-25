import { View, Text, KeyboardAvoidingView, ScrollView, Linking, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import Toast from "react-native-toast-message";
import HeaderFixo from "../../components/HeaderFixo";
import { SafeAreaView } from "react-native-safe-area-context";
import GetHospedagemResponseDto from "../../types/dto/GetHospedagemPorViagemDto";
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

function DetalhesHospedagem({ route }: any) {

  const { hospedagem } = route.params as { hospedagem: GetHospedagemResponseDto };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isConfirmandoExcluir, setIsConfirmandoExcluir] = useState(false);

  async function handleOpenAddressInMaps() {
    const address = hospedagem.endereco;

    if (!address) {
      console.warn("Endereço não disponível.");
      Toast.show({
        type: 'info',
        text1: 'Endereço não disponível',
        text2: 'Não foi possível abrir o mapa.',
        visibilityTime: 3000,
      });
      return; // Sai da função se não tiver endereço
    }

    // Codifica o endereço para ser usado na URL (essencial para espaços e caracteres especiais)
    const encodedAddress = encodeURIComponent(address);

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    try {
      // Verifica se o dispositivo pode abrir esta URL (se o Google Maps ou navegador estiver instalado)
      const supported = await Linking.canOpenURL(googleMapsUrl);

      if (supported) {
        // Abre o URL
        await Linking.openURL(googleMapsUrl);
      } else {
        console.error(`Não é possível abrir o URL: ${googleMapsUrl}`);
        Toast.show({
          type: 'error',
          text1: 'Erro ao abrir mapa',
          text2: 'Verifique se você tem um aplicativo de mapas instalado.',
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      console.error("Erro ao tentar abrir o mapa:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Ocorreu um erro ao tentar abrir o mapa.',
        visibilityTime: 4000,
      });
    }
  };

  // Função para lidar com o clique no botão "Abrir Comprovante"
  const handleOpenDocument = async () => {
      if (hospedagem.documento_anexo) {
        // Chama a função para abrir o arquivo salvo localmente
        await openLocalDocument(hospedagem.documento_anexo);
      } else {
        console.warn("Caminho do documento não disponível para esta hospedagem.");
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Caminho do documento não disponível para esta hospedagem.',
          visibilityTime: 4000,
        });
      }
  };

  async function excluirHospedagem() {

    const currentDocumentPath = hospedagem.documento_anexo;
    if (currentDocumentPath) {
      await deleteLocalDocument(currentDocumentPath);
    }

    let viagemParaNavegar: GetViagensResponseDto | null = null;

    try {
      const responseViagem = await travelerApi.get(`/viagem/${hospedagem.viagem_id}`);
      viagemParaNavegar = responseViagem.data;
    } catch (error) {
      console.error("Erro ao buscar dados da viagem antes de excluir hospedagem:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar dados da viagem. Tentando excluir mesmo assim.',
        visibilityTime: 3000,
      });
    }
    try {
      await travelerApi.delete(`/hospedagem/${hospedagem.id}/delete`);

      if (viagemParaNavegar) {
        navigation.navigate('ViagemSelecionada', { viagem: viagemParaNavegar });
      } else {
        navigation.navigate('Viagens');
      }
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Hospedagem excluída com sucesso.',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Erro ao excluir hospedagem:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao excluir hospedagem.',
        visibilityTime: 3000,
      });
    }
  }

  function handleExcluirHospedagem() {
    setIsConfirmandoExcluir(true);
  }

  function handleConfirmarExcluir() {
    excluirHospedagem().then(() => {
      setIsConfirmandoExcluir(false);
    });
  }

  function handleCancelarExcluir() {
    setIsConfirmandoExcluir(false);
  }

  return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderFixo />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Titulo texto="Hospedagem" />
            <View style={styles.cardPontilhadoContainer}>
              <View style={styles.cardPontilhadoCima}>
                <View style={styles.containerInfos}>
                  <Text style={styles.textoHospedagem}>{hospedagem.nome}</Text>
                </View>
                <View style={styles.containerInfos}>
                  <Text style={styles.textoHospedagem}>Tipo: </Text>
                  <Text style={styles.dadosHospedagem}>{hospedagem.tipo_hospedagem.descricao}</Text>
                </View>
              </View>
              <View style={styles.dottedLine} />
              <View style={styles.cardPontilhadoBaixo}>
                <View style={styles.containerInfos}>
                  <View style={styles.containerData}>
                    <Text style={styles.textCheckInOut}>Check-in</Text>
                    <View style={styles.containerDataIcone}>
                      <MaterialCommunityIcons name={'arrow-up-bold-box'} size={30} color='#2b88d9' style={styles.dateIcons}/>
                      <Text style={styles.dateText}>{formatDate(hospedagem.data_checkin)}</Text>
                    </View>
                  </View>
                  <FontAwesome5Icon name={'arrows-alt-h'} size={30} color='#2b88d9' style={styles.arrow}/>
                  <View style={styles.containerData}>
                    <Text style={styles.textCheckInOut}>Check-out</Text>
                    <View style={styles.containerDataIcone}>
                      <MaterialCommunityIcons name={'arrow-down-bold-box'} size={30} color='#2b88d9' style={styles.dateIcons}/>
                      <Text style={styles.dateText}>{formatDate(hospedagem.data_checkout)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <Titulo texto="Localização" />
            <View style={styles.card}>
              <View style={styles.containerEndereco}>
                <FontAwesome5Icon name={'map-marker-alt'} size={30} color='#2b88d9'/>
                {
                  true ? (
                    <Text style={styles.textoEndereco} onPress={handleOpenAddressInMaps}>
                      "Rua tal, 123 - Bairro tal, Cidade tal - Estado tal" Mais textos aqui lalalala
                    </Text>
                  ) : (
                    <Text style={styles.textoHospedagem}>Nenhum endereço encontrado</Text>
                  )
                }
              </View>
            </View>
            <Titulo texto="Anexo" />
              <View style={styles.card}>
                <TouchableOpacity style={styles.containerInfos} onPress={handleOpenDocument}>
                  <MaterialCommunityIcons name={'file-document'} size={30} color='#2b88d9'/>
                  {
                    hospedagem.documento_anexo ? (
                      <Text style={styles.textoHospedagem} >
                        {hospedagem.documento_anexo}
                      </Text>
                    ) : (
                      <Text style={styles.textoHospedagem}>Nenhum documento anexado</Text>
                    )
                  }
                </TouchableOpacity>
              </View>
            <Titulo texto="Despesa" />
              <View style={styles.card}>
                <View style={styles.containerInfos}>
                  <Text style={styles.textoHospedagem}>Valor: </Text>
                  <Text style={styles.dadosHospedagem}>{formatarParaReal(hospedagem.despesa.valor)}</Text>
                </View>
              </View>
            
            <View style={styles.containerBotoes}>
              <BotaoSecundario label={<MaterialIcons name={'edit'} size={22} color='#2b88d9'/>} onPress={() => {}} />
              <BotaoExcluir onPress={handleExcluirHospedagem} />
            </View>

          </ScrollView>
          <Toast />
          {
            isConfirmandoExcluir && (
              <ModalConfirmacaoExcluir onPressExcluir={handleConfirmarExcluir} onPressCancelar={handleCancelarExcluir}/>
            )
          }
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default DetalhesHospedagem;

