import { FlatList, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from "./styles";
import HeaderFixo from "../../components/HeaderFixo";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { formatarIntervaloDatas, formatDate } from "../../utils/DataFormat";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalNovoItem from "../../components/ModalNovoItem";
import { useCallback, useEffect, useState } from "react";
import Input from "../../components/InputCadastro";
import travelerApi from "../../services/api/travelerApi";
import Loading from "../../components/Loading";
import CardItemDespesa from "../../components/CardItemDespesa";
import Titulo from "../../components/Titulo";
import Botao from "../../components/Botao";
import CardItemTransporte from "../../components/CardItemTransporte";
import { SafeAreaView } from "react-native-safe-area-context";
import GetTransportesPorViagemDto from "../../types/dto/GetTransportesPorViagemDto";
import CadastroDespesaResponseDto from "../../types/dto/CadastroDespesaResponseDto";
import GetHospedagemResponseDto from "../../types/dto/GetHospedagemPorViagemDto";
import CardItemHospedagem from "../../components/CardItemHospedagem";
import GetPasseiosPorViagemDto from "../../types/dto/GetPasseiosPorViagemDto";
import CardItemPasseio from "../../components/CardItemPasseio";
import GetTransporteResponseDto from "../../types/dto/GetTransportePorViagemDto";
import ModalConfirmacaoExcluir from "../../components/ModalConfirmacaoExcluir";
import GetDespesaResponseDto from "../../types/dto/GetDepesaResponseDto";
import { set } from "zod";

function FinanceiroViagemSelecionada() {

  const route = useRoute();
  const { viagem } = route.params as { viagem: GetViagensResponseDto };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [despesa, setDespesa] = useState<CadastroDespesaResponseDto[]>();
  const [viagemAtualizada, setViagemAtualizada] = useState<GetViagensResponseDto>(viagem);
  const [dataInicioFimFormatada, setDataInicioFimFormatada] = useState<string>();

  const renderCardItemDespesa = ({ item }: { item: CadastroDespesaResponseDto }) => (
    <CardItemDespesa despesa={item} viagem={viagem} />
  );

  const buscarDespesas = async () => {
    setIsLoading(true);
    try {
      const response = await travelerApi.get(`/despesa/viagem/${viagem.id}`);

      // const tiposExcluidos = [2, 3, 4]; // Excluir Tranporte, Hospedagem e Passeio
      // console.log(response.data);
      // const despesasFiltradas = response.data.filter((despesa: GetDespesaResponseDto) => !tiposExcluidos.includes(despesa.tipo_despesa_id));
            
      setDespesa(response.data);

      console.log("Despesas filtradas:", response.data);

    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    }
  }

  const buscarViagemAtualizada = async () => {
  try {
    const response = await travelerApi.get(`/viagem/${viagem.id}`);
    setViagemAtualizada(response.data);
  } catch (error) {
    console.error("Erro ao buscar dados atualizados da viagem:", error);
  }
};

  // Usando useFocusEffect para carregar viagens ao voltar para a tela
  useFocusEffect(
    useCallback(() => {
      buscarViagemAtualizada();
      buscarDespesas();
      setIsLoading(false);
    }, [viagem.id])
  );

  useEffect(() => {
    if(viagemAtualizada) {
      setDataInicioFimFormatada(formatarIntervaloDatas(viagemAtualizada.data_inicio, viagemAtualizada.data_fim));
    }
  }, [viagemAtualizada]); 

  return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderFixo />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}>
              <View style={styles.dateWrapper}>
                <FontAwesome6Icon name="calendar" size={20} color="#2b88d9" />
                <Text style={styles.data}>{dataInicioFimFormatada}</Text>
              </View>
              <Text style={styles.titulo}>{viagemAtualizada.nome}</Text>
            </View>
            {isLoading && 
              <View style={styles.wrapper}>
                <Loading />
              </View>
            }
            {!isLoading && (
              <>
                <View style={styles.wrapper}>
                  <Text>TESTE</Text>
                </View>
              </>
            )}
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default FinanceiroViagemSelecionada;
