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
import GetDespesaResponseDto from "../../types/dto/GetDepesaResponseDto";

function DetalhesDespesa({ route }: any) {
  const { despesa, viagem } = route.params as { despesa: GetDespesaResponseDto, viagem: GetViagensResponseDto };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isConfirmandoExcluir, setIsConfirmandoExcluir] = useState(false);

  async function excluirDespesa() {

    let viagemParaNavegar: GetViagensResponseDto | null = null;

    try {
      const responseViagem = await travelerApi.get(`/viagem/${despesa.viagem_id}`);
      viagemParaNavegar = responseViagem.data;
    } catch (error) {
      console.error("Erro ao buscar dados da viagem antes de excluir despesa:", error);
    }

    try {
      await travelerApi.delete(`/passeio/${despesa.id}/delete`);

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
      console.error("Erro ao excluir despesa:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao excluir despesa.',
        visibilityTime: 3000,
      });
    }
  }

  function handleExcluirDespesa() {
    setIsConfirmandoExcluir(true);
  }

  function handleConfirmarExcluir() {
    excluirDespesa().then(() => {
      setIsConfirmandoExcluir(false);
    });
  }

  function handleCancelarExcluir() {
    setIsConfirmandoExcluir(false);
  }

  function handleEditar() {
    // navigation.navigate('EditarDepesa', { despesa, viagem });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderFixo />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Titulo texto="Despesa" />
            <View style={styles.cardPontilhadoContainer}>
              <View style={styles.cardPontilhadoCima}>
                <FontAwesome5Icon
                  name='coins'
                  size={30}
                  color='#2b88d9'
                  style={styles.dateIcons}
                />
                <View style={styles.wrapperInfos}>
                  <View style={styles.containerInfos}>
                    <Text style={styles.textoHospedagem}>{despesa.descricao}</Text>
                  </View>
                  <View style={styles.containerInfos}>
                    <Text style={styles.textoHospedagem}>Tipo: </Text>
                    <Text style={styles.dadosHospedagem}>{despesa.tipo_despesa.descricao}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.dottedLine} />
              <View style={styles.cardPontilhadoBaixo}>
                <View style={styles.containerInfos}>
                  <View style={styles.containerData}>
                    <Text style={styles.textCheckInOut}>Data da Despesa</Text>
                    <View style={styles.containerDataIcone}>
                      <FontAwesome5Icon name={'calendar-alt'} size={30} color='#2b88d9' style={styles.dateIcons} />
                      <Text style={styles.dateText}>{formatDate(despesa.data)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <Titulo texto="Valor" />
            <View style={styles.card}>
              <View style={styles.containerInfos}>
                <Text style={styles.dadosHospedagem}>{formatarParaReal(despesa.valor)}</Text>
              </View>
            </View>

            <View style={styles.containerBotoes}>
              <BotaoSecundario label={<MaterialIcons name={'edit'} size={22} color='#2b88d9' />} onPress={handleEditar} />
              <BotaoExcluir onPress={handleExcluirDespesa} />
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

export default DetalhesDespesa;