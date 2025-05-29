import { View, Text, KeyboardAvoidingView, ScrollView, Linking, TouchableOpacity } from "react-native";

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
import GetTransporteResponseDto from "../../types/dto/GetTransportePorViagemDto";

function DetalhesTransporte({ route }: any) {

  const { transporte } = route.params as { transporte: GetTransporteResponseDto };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isConfirmandoExcluir, setIsConfirmandoExcluir] = useState(false);

  // Função para lidar com o clique no botão "Abrir Comprovante"
  const handleOpenDocument = async () => {
      if (transporte.documento_anexo) {
        console.log("Caminho do documento:", transporte.documento_anexo);
        // Chama a função para abrir o arquivo salvo localmente
        await openLocalDocument(transporte.documento_anexo);
      } else {
        console.warn("Caminho do documento não disponível para esta transporte.");
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Caminho do documento não disponível para esta transporte.',
          visibilityTime: 4000,
        });
      }
  };

  async function excluirTransporte() {

    const currentDocumentPath = transporte.documento_anexo;
    if (currentDocumentPath) {
      await deleteLocalDocument(currentDocumentPath);
    }

    let viagemParaNavegar: GetViagensResponseDto | null = null;

    try {
      const responseViagem = await travelerApi.get(`/viagem/${transporte.viagem_id}`);
      viagemParaNavegar = responseViagem.data;
    } catch (error) {
      console.error("Erro ao buscar dados da viagem antes de excluir transporte:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar dados da viagem. Tentando excluir mesmo assim.',
        visibilityTime: 3000,
      });
    }
    try {
      await travelerApi.delete(`/transporte/${transporte.id}/delete`);

      if (viagemParaNavegar) {
        navigation.navigate('ViagemSelecionada', { viagem: viagemParaNavegar });
      } else {
        navigation.navigate('Viagens');
      }
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Transporte excluído com sucesso.',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Erro ao excluir transporte:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao excluir transporte.',
        visibilityTime: 3000,
      });
    }
  }

  function handleExcluirHospedagem() {
    setIsConfirmandoExcluir(true);
  }

  function handleConfirmarExcluir() {
    excluirTransporte().then(() => {
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
            <Titulo texto="Transporte" />
            <View style={styles.cardPontilhadoContainer}>
              <View style={styles.cardPontilhadoCima}>
                <View style={styles.containerInfos}>
                  <Text style={styles.textoHospedagem}>{transporte.nome}</Text>
                </View>
                <View style={styles.containerInfos}>
                  <Text style={styles.textoHospedagem}>Tipo: </Text>
                  <Text style={styles.dadosHospedagem}>{transporte.tipo_transporte.descricao}</Text>
                </View>
              </View>
              <View style={styles.dottedLine} />
              <View style={styles.cardPontilhadoBaixo}>
                <View style={styles.containerInfos}>
                  <View style={styles.containerData}>
                    <Text style={styles.textCheckInOut}>Embarque</Text>
                    <View style={styles.containerDataIcone}>
                      <FontAwesome5Icon name={'plane-departure'} size={30} color='#2b88d9' style={styles.dateIcons}/>
                      <Text style={styles.dateText}>{formatDate(transporte.data)}</Text>
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
                    // <Text style={styles.textoEndereco} onPress={handleOpenAddressInMaps}>
                    //   "Rua tal, 123 - Bairro tal, Cidade tal - Estado tal" Mais textos aqui lalalala
                    // </Text>
                    <Text>{transporte.transporte_destino.nm_municipio} - {transporte.transporte_destino.nm_estado}</Text>
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
                    transporte.documento_anexo ? (
                      <Text style={styles.textoHospedagem} >
                        {transporte.documento_anexo}
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
                  <Text style={styles.dadosHospedagem}>{formatarParaReal(transporte.despesa.valor)}</Text>
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

export default DetalhesTransporte;

