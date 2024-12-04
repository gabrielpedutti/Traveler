import { View, Text, FlatList } from "react-native";
import HeaderFixo from "../../components/HeaderFixo";
import ItemViagem from "../../components/ItemViagem";
import BotaoAdicionar from "../../components/BotaoAdicionar";
import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import { useCallback, useContext, useState } from "react";
import travelerApi from "../../services/api/travelerApi";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { CadastroContext } from "../../contexts/cadastro";
import Loading from "../../components/Loading";
import { useFocusEffect } from "@react-navigation/native";

function Viagens() {
  const { user } = useContext(CadastroContext);
  const [viagens, setViagens] = useState<GetViagensResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para carregar viagens
  const carregarViagens = async () => {
    try {
      setIsLoading(true);
      const response = await travelerApi.get(`/viagem/usuario/${user.id}`);
      setViagens(response.data);
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Usando useFocusEffect para carregar viagens ao voltar para a tela
  useFocusEffect(
    useCallback(() => {
      // Chama a função de forma síncrona
      carregarViagens();
    }, [user.id])
  );

  const renderItem = ({ item }: { item: GetViagensResponseDto }) => (
    <ItemViagem item={item} />
  );

  return (
    <View style={styles.container}>
      <HeaderFixo />
      <Titulo texto="Viagens" />
      {isLoading ? (
        <View style={styles.wrapper}>
          <Loading />
        </View>
      ) : viagens.length === 0 ? (
        <View style={styles.wrapper}>
          <Text style={styles.text}>Você ainda não possui nenhuma viagem cadastrada.</Text>
        </View>
      ) : (
        <FlatList
          data={viagens}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <BotaoAdicionar />
    </View>
  );
}

export default Viagens;
