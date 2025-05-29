import { FlatList, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from "./styles";
import HeaderFixo from "../../components/HeaderFixo";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { formatDate } from "../../utils/DataFormat";
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

function ViagemSelecionada() {

  const route = useRoute();
  const { viagem } = route.params as { viagem: GetViagensResponseDto };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transporte, setTransporte] = useState<GetTransportesPorViagemDto[]>();
  const [hospedagem, setHospedagem] = useState<GetHospedagemResponseDto[]>();
  const [passeio, setPasseio] = useState<GetPasseiosPorViagemDto[]>();
  const [despesa, setDespesa] = useState<CadastroDespesaResponseDto[]>();

  function handleModal() {
    setIsModalVisible(!isModalVisible);
  }

  const renderCardItemTransporte = ({ item }: { item: GetTransporteResponseDto }) => (
    <CardItemTransporte item={item} />
  );

  const renderCardItemDespesa = ({ item }: { item: CadastroDespesaResponseDto }) => (
    <CardItemDespesa item={item} />
  );

  const renderCardItemHospedagem = ({ item }: { item: GetHospedagemResponseDto }) => (
    <CardItemHospedagem item={item} />
  );

  const renderCardItemPasseio = ({ item }: { item: GetPasseiosPorViagemDto }) => (
    <CardItemPasseio item={item} />
  );


  const buscarDespesas = async () => {
    setIsLoading(true);
    try {
      const response = await travelerApi.get(`/despesa/viagem/${viagem.id}`);
      
      setDespesa(response.data);

    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    }
  }

  const buscarTransporte = async () => {
    try {
      const response = await travelerApi.get(`/transporte/viagem/${viagem.id}`);
      setTransporte(response.data);
    } catch (error) {
      console.error("Erro ao buscar transporte:", error);
    }
  }

  const buscarHospedagem = async () => {
    try {
      const response = await travelerApi.get(`/hospedagem/viagem/${viagem.id}`);
      setHospedagem(response.data);
    } catch (error) {
      console.error("Erro ao buscar hospedagem:", error);
    }
  }

  const buscarPasseio = async () => {
    try {
      const response = await travelerApi.get(`/passeio/viagem/${viagem.id}`);
      setPasseio(response.data);
    } catch (error) {
      console.error("Erro ao buscar passeio:", error);
    }
  }

  // useEffect(() => {
  //   buscarDespesas();
  //   buscarTransporte();
  //   buscarHospedagem();
  //   buscarPasseio();
  //   setIsLoading(false);
  // }, []);

  // Usando useFocusEffect para carregar viagens ao voltar para a tela
  useFocusEffect(
    useCallback(() => {
      // Chama a função de forma síncrona
      if(isModalVisible) {
        handleModal();
      }
      buscarDespesas();
      buscarTransporte();
      buscarHospedagem();
      buscarPasseio();
      setIsLoading(false);
    }, [viagem.id])
  );
  

  function excluirViagem() {
    travelerApi.delete(`/viagem/${viagem.id}/delete`)
      .then(() => {
        navigation.navigate('Viagens');
      })
      .catch((error) => {
        console.error("Erro ao excluir viagem:", error);
      })
  }

  function botaoExcluir() {
    return(
      <View style={styles.wrapperExcluir}>
        <TouchableOpacity style={styles.botaoExcluir} onPress={excluirViagem}>
          <Text style={styles.textoExcluir}>Excluir Viagem</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderFixo />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.noImage}>
              <FontAwesome6Icon name={'image'} size={40} color='#000' style={styles.icon}/>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name={'edit'} size={40} color='#000' style={styles.icon}/>
              </TouchableOpacity>
            </View>
            <View style={styles.headerContainer}>
              <View style={styles.titleWrapper}>
                <Text style={styles.titulo}>{viagem.nome}</Text>
                <Text style={styles.data}>{formatDate(viagem.data_inicio)}</Text>
              </View>
            </View>
            {isLoading && 
              <View style={styles.wrapper}>
                <Loading />
              </View>
            }
            {!isLoading && 
              <FlatList
                ListHeaderComponent={<Titulo texto="Transportes" />}
                data={transporte}
                renderItem={renderCardItemTransporte}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <View style={styles.wrapper}>
                    <Text style={styles.text}>Você ainda não possui nenhum transporte cadastrado.</Text>
                  </View>
                }
                scrollEnabled={false} // Desativa o scroll na FlatList
              />
            }
            {!isLoading && 
              <FlatList
                ListHeaderComponent={<Titulo texto="Hospedagens" />}
                data={hospedagem}
                renderItem={renderCardItemHospedagem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <View style={styles.wrapper}>
                    <Text style={styles.text}>Você ainda não possui nenhuma hospedagem cadastrada.</Text>
                  </View>
                }
                scrollEnabled={false} // Desativa o scroll na FlatList
              />
            }
            {!isLoading && 
              <FlatList
                ListHeaderComponent={<Titulo texto="Passeios Turísticos" />}
                data={passeio}
                renderItem={renderCardItemPasseio}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <View style={styles.wrapper}>
                    <Text style={styles.text}>Você ainda não possui nenhum passeio turístico cadastrado.</Text>
                  </View>
                }
                scrollEnabled={false} // Desativa o scroll na FlatList
              />
            }
            {!isLoading && 
              <FlatList
                ListHeaderComponent={<Titulo texto="Despesas" />}
                data={despesa}
                renderItem={renderCardItemDespesa}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={botaoExcluir}
                ListEmptyComponent={
                  <View style={styles.wrapper}>
                    <Text style={styles.text}>Você ainda não possui nenhuma despesa cadastrada.</Text>
                  </View>
                }
                scrollEnabled={false} // Desativa o scroll na FlatList
              />
            }

          </ScrollView>
          {isModalVisible && <ModalNovoItem closeModal={handleModal} viagem={viagem}/>}
          <Toast />
          <TouchableOpacity style={styles.botaoMais} onPress={handleModal}>
              <AntDesign name={'plus'} size={35} color='#fff'/>
            </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default ViagemSelecionada;
