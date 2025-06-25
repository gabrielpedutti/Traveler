import { Dimensions, FlatList, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { styles } from "./styles";
import HeaderFixo from "../../components/HeaderFixo";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { formatarIntervaloDatas } from "../../utils/DataFormat";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { useCallback, useEffect, useState } from "react";
import travelerApi from "../../services/api/travelerApi";
import Loading from "../../components/Loading";
import CardItemDespesa from "../../components/CardItemDespesa";
import { SafeAreaView } from "react-native-safe-area-context";
import CadastroDespesaResponseDto from "../../types/dto/CadastroDespesaResponseDto";
import { PieChart } from "react-native-chart-kit";
import GetDespesaResponseDto from "../../types/dto/GetDepesaResponseDto";
import Titulo from "../../components/Titulo";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;

function FinanceiroViagemSelecionada() {

  const route = useRoute();
  const { viagem } = route.params as { viagem: GetViagensResponseDto };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [despesa, setDespesa] = useState<CadastroDespesaResponseDto[]>();
  const [viagemAtualizada, setViagemAtualizada] = useState<GetViagensResponseDto>(viagem);
  const [dataInicioFimFormatada, setDataInicioFimFormatada] = useState<string>();
  const [allGeneralExpenses, setAllGeneralExpenses] = useState<GetDespesaResponseDto[] | undefined>(undefined);
  const [displayedExpenses, setDisplayedExpenses] = useState<GetDespesaResponseDto[] | undefined>(undefined);
  const [originalPieChartData, setOriginalPieChartData] = useState<any[]>([]); // Dados brutos para o gráfico
  const [displayedPieChartData, setDisplayedPieChartData] = useState<any[]>([]); 
  const [selectedExpenseType, setSelectedExpenseType] = useState<number | null>(null);
  const [totalDespesas, setTotalDespesas] = useState<number>(0);

  const renderCardItemDespesa = ({ item }: { item: GetDespesaResponseDto }) => (
    <CardItemDespesa despesa={item} viagem={viagemAtualizada} />
  );

  const buscarDespesas = async () => {
    setIsLoading(true);
    try {
      const response = await travelerApi.get(`/despesa/viagem/${viagem.id}`);

      // const tiposExcluidos = [2, 3, 4]; // Excluir Tranporte, Hospedagem e Passeio
      // console.log(response.data);
      // const despesasFiltradas = response.data.filter((despesa: GetDespesaResponseDto) => !tiposExcluidos.includes(despesa.tipo_despesa_id));
            
      const despesa = response.data;
      setDespesa(despesa);
      setAllGeneralExpenses(despesa);
      setDisplayedExpenses(despesa); 

      const despesasAgrupadas: { [key: number]: { total: number, name: string, id: number, color?: string } } = {};
      const defaultColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#952d7e', '#4c4c4c', '#5e963b', '#cc2f2f'
      ];
      let colorIndex = 0;
      let totalGeral = 0;

      despesa.forEach((despesaItem: GetDespesaResponseDto) => {
        const tipoId = despesaItem.tipo_despesa_id;
        const tipoDescricao = despesaItem.tipo_despesa?.descricao || 'Outros';
        totalGeral += despesaItem.valor;

        if (tipoId !== undefined && tipoId !== null) {
          if (!despesasAgrupadas[tipoId]) {
            despesasAgrupadas[tipoId] = {
              total: 0,
              name: tipoDescricao,
              id: tipoId,
              color: defaultColors[colorIndex % defaultColors.length]
            };
            colorIndex++;
          }
          despesasAgrupadas[tipoId].total += despesaItem.valor;
        } else {
          const outrosId = 0; // ID padrão para 'Outros' se tipoId for null/undefined
          if (!despesasAgrupadas[outrosId]) {
             despesasAgrupadas[outrosId] = {
                total: 0,
                name: 'Outros',
                id: outrosId,
                color: defaultColors[colorIndex % defaultColors.length]
             };
             colorIndex++;
          }
          despesasAgrupadas[outrosId].total += despesaItem.valor;
        }
      });

      const chartData = Object.keys(despesasAgrupadas).map(idStr => {
        const idNum = Number(idStr);
        const item = despesasAgrupadas[idNum];
        const valorFormatado = item.total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        return {
          name: item.name, // Ex: Alimentação (R$ 120,50)
          population: item.total,
          color: item.color,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
          id: item.id, // Adiciona o ID ao objeto de dados do gráfico
        };
      });
      setOriginalPieChartData(chartData); // Armazena os dados originais do gráfico
      setTotalDespesas(totalGeral);

    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
      Toast.show({ type: "error", text1: "Erro", text2: "Falha ao carregar despesas.", visibilityTime: 3000 });
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  }

  const buscarViagemAtualizada = async () => {
    try {
      const response = await travelerApi.get(`/viagem/${viagem.id}`);
      setViagemAtualizada(response.data);
      if (response.data.data_inicio && response.data.data_fim) {
        const formattedInterval = formatarIntervaloDatas(response.data.data_inicio, response.data.data_fim);
        setDataInicioFimFormatada(formattedInterval);
      }
    } catch (error) {
      console.error("Erro ao buscar dados atualizados da viagem:", error);
      Toast.show({ type: "error", text1: "Erro", text2: "Não foi possível carregar dados atualizados da viagem.", visibilityTime: 3000 });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([
          buscarViagemAtualizada(),
          buscarDespesas(), // Esta função agora também popula o pieChartData
        ]);
        // setIsLoading(false);
      };
      fetchData();
    }, [viagem.id])
  );

  useEffect(() => {
    if(viagemAtualizada) {
      setDataInicioFimFormatada(formatarIntervaloDatas(viagemAtualizada.data_inicio, viagemAtualizada.data_fim));
    }
  }, [viagemAtualizada]); 

  useEffect(() => {
    if (selectedExpenseType === null) {
      // Se nenhum tipo estiver selecionado (null), exibe todas as despesas gerais
      setDisplayedExpenses(allGeneralExpenses);
      // Gráfico: todas as fatias com opacidade total
      setDisplayedPieChartData(originalPieChartData.map(slice => ({
        ...slice,
        color: slice.color.replace(/,(\d+(\.\d+)?)?\)/, ',1)') // Altera opacidade para 1
      })));
    } else if (allGeneralExpenses && originalPieChartData) {
      // Filtra as despesas pelo ID do tipo selecionado
      const filtered = allGeneralExpenses.filter(
        (despesaItem: GetDespesaResponseDto) => 
          despesaItem.tipo_despesa_id === selectedExpenseType 
      );
      setDisplayedExpenses(filtered);

      // Gráfico: a fatia selecionada com opacidade total, outras com opacidade reduzida
      setDisplayedPieChartData(originalPieChartData.map(slice => ({
        ...slice,
        color: slice.id === selectedExpenseType 
                 ? slice.color.replace(/,(\d+(\.\d+)?)?\)/, ',1)') // Opacidade total para a selecionada
                 : slice.color.replace(/,(\d+(\.\d+)?)?\)/, ',0.4)') // Opacidade reduzida para as não selecionadas
      })));
    }
  }, [selectedExpenseType, allGeneralExpenses, originalPieChartData]);


  // Configurações para o gráfico de pizza
  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor genérica para texto/eixo
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0, // Não mostrar casas decimais nos rótulos de porcentagem
  };

  // Funções de Modal (mantidas se forem usadas fora deste snippet)
  // function handleModal() { /* ... */ }

  // Função para obter o nome do tipo de despesa selecionado para o título do FlatList/Botão
  const getSelectedExpenseTypeName = (id: number | null) => {
    if (id === null) return null;
    const selectedItem = originalPieChartData.find(item => item.id === id);
    return selectedItem?.name || 'Tipo Desconhecido';
  };

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
                {originalPieChartData.length > 0 && ( // Usa originalPieChartData para verificar se há dados para o gráfico
                  <View style={styles.chartContainer}>
                    <Titulo texto="Análise de Despesas" />
                    <Text style={styles.totalExpensesText}>
                      Total: {totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedExpenseType}
                        onValueChange={(itemValue: number | null) => setSelectedExpenseType(itemValue)}
                      >
                        <Picker.Item label="Todas as Despesas" value={null} />
                        {originalPieChartData.map((dataItem: any) => (
                          <Picker.Item key={dataItem.id} label={dataItem.name} value={dataItem.id} />
                        ))}
                      </Picker>
                    </View>

                    <PieChart
                      data={displayedPieChartData} // Usa os dados com opacidade ajustada
                      width={screenWidth - 32}
                      height={220}
                      chartConfig={chartConfig}
                      accessor={"population"}
                      backgroundColor={"transparent"}
                      paddingLeft={"15"}
                      center={[10, 10]}
                      absolute
                      
                      // Sem onPress aqui no PieChart principal
                    />
                    {/* O botão "Limpar Filtro" pode ser removido se o "Todas as Despesas" no Picker for suficiente.
                        Mas se quiser manter um botão visual, aqui está.
                    */}
                    {selectedExpenseType !== null && (
                      <TouchableOpacity onPress={() => setSelectedExpenseType(null)} style={styles.resetFilterButton}>
                        <Text style={styles.resetFilterButtonText}>
                          Limpar Filtro ({getSelectedExpenseTypeName(selectedExpenseType)})
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <FlatList
                  ListHeaderComponent={<Titulo texto={selectedExpenseType !== null ? `Despesas de ${getSelectedExpenseTypeName(selectedExpenseType)}` : "Despesas"} />}
                  data={displayedExpenses}
                  renderItem={renderCardItemDespesa}
                  keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                  ListEmptyComponent={
                    <View style={styles.wrapper}>
                      <Text style={styles.text}>
                        {selectedExpenseType !== null ? 
                          `Não há despesas de ${getSelectedExpenseTypeName(selectedExpenseType)} cadastradas para esta viagem.` :
                          "Você ainda não possui despesas cadastradas para esta viagem."}
                      </Text>
                    </View>
                  }
                  scrollEnabled={false}
                />
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
