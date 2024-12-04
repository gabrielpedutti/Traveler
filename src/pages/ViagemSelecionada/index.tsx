import { FlatList, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from "./styles";
import HeaderFixo from "../../components/HeaderFixo";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatDate } from "../../utils/DataFormat";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalNovoItem from "../../components/ModalNovoItem";
import { useEffect, useState } from "react";
import Input from "../../components/InputCadastro";
import travelerApi from "../../services/api/travelerApi";
import Loading from "../../components/Loading";
import ItemDespesa from "../../components/ItemDespesa";
import Titulo from "../../components/Titulo";
import Botao from "../../components/Botao";
import ItemTransporte from "../../components/ItemTransporte";

function ViagemSelecionada() {

  const route = useRoute();
  const { item } = route.params as { item: GetViagensResponseDto };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transporte, setTransporte] = useState<GetTransportesPorViagemDto[]>();
  const [hospedagem, setHospedagem] = useState<string>('');
  const [passeio, setPasseio] = useState<string>('');
  const [despesa, setDespesa] = useState<CadastroDespesaResponseDto[]>();

  function handleModal() {
    setIsModalVisible(!isModalVisible);
  }

  const renderItemTransporte = ({ item }: { item: GetTransportesPorViagemDto }) => (
    <ItemTransporte item={item} />
  );

  const renderItemDespesa = ({ item }: { item: CadastroDespesaResponseDto }) => (
    <ItemDespesa item={item} />
  );

  useEffect(() => {
    const buscarDespesas = async () => {
      setIsLoading(true);
      try {
        const response = await travelerApi.get(`/despesa/viagem/${item.id}`);
        
        setDespesa(response.data);

      } catch (error) {
        console.error("Erro ao buscar despesas:", error);
      }
    }

    const buscarTransporte = async () => {
      try {
        const response = await travelerApi.get(`/transporte/viagem/${item.id}`);
        setTransporte(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar transporte:", error);
      }
    }

    buscarDespesas();
    buscarTransporte();
  }, []);

  function excluirViagem() {
    travelerApi.delete(`/viagem/${item.id}/delete`)
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
              <Text style={styles.titulo}>{item.nome}</Text>
              <Text style={styles.data}>{formatDate(item.data_inicio)}</Text>
            </View>
            <Text style={styles.descricao}>{item.descricao}</Text>
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
              renderItem={renderItemTransporte}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<>
                <View style={styles.wrapper}>
                  <Text style={styles.text}>Você ainda não possui nenhum transporte cadastrado.</Text>
                </View>
              </>}
              scrollEnabled={false} // Desativa o scroll na FlatList
            />
          }
          {!isLoading && 
            <FlatList
              ListHeaderComponent={<Titulo texto="Despesas" />}
              data={despesa}
              renderItem={renderItemDespesa}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={botaoExcluir}
              ListEmptyComponent={<>
                <View style={styles.wrapper}>
                  <Text style={styles.text}>Você ainda não possui nenhuma despesa cadastrada.</Text>
                </View>
              </>}
              scrollEnabled={false} // Desativa o scroll na FlatList
            />
          }
          <TouchableOpacity style={styles.botaoMais} onPress={handleModal}>
            <AntDesign name={'plus'} size={35} color='#fff'/>
          </TouchableOpacity>
          {isModalVisible && <ModalNovoItem closeModal={handleModal}/>}
          <Toast />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ViagemSelecionada;
