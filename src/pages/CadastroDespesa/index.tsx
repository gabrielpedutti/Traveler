import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import Input from "../../components/InputCadastro";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { DateInput } from "../../components/DateInput";
import Botao from "../../components/Botao";
import Toast from "react-native-toast-message";
import HeaderFixo from "../../components/HeaderFixo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useContext } from "react";
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import { CadastroDespesaRouteProp, RootStackParamList } from "../../types/RootStackParamList";
import travelerApi from "../../services/api/travelerApi";
import { formatToISOString } from "../../utils/DataFormat";
import { CadastroContext } from "../../contexts/cadastro";
import { cadastrarDespesaBanco } from "../../services/httpService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GetTipoDespesaDto from "../../types/dto/GetTipoDespesaDto";
import { InputValor } from "../../components/InputValor";

const cadastroDespesaSchema = z.object({
  descricao: z.string().min(1, "O nome da despesa é obrigatório."),
  tipoDespesa:   z.union([z.string(), z.number()]) // Aceita tanto string quanto número
  .refine((val) => !isNaN(Number(val)), { message: "Tipo da despesa é obrigatório" }) // Verifica se é um número válido
  .transform((val) => {
    // Se for string (iOS), converte para número, se já for número (Android), deixa como está
    return Platform.OS === 'ios' ? Number(val) : val;
  })
  .refine((val) => Number(val) > 0, { message: "Tipo da despesa é obrigatório" }),
  data: z.string().min(1, "Data é obrigatório"),
  valor: z.string()
    .min(1, "O valor é obrigatório.")
    .transform((val) => {
      console.log("Valor recebido:", val);
      const cleanedValue = val.replace(/[R$\s.]/g, '').replace(',', '.');
      console.log("Valor limpo:", cleanedValue);
      const num = parseFloat(cleanedValue);
      console.log("Número convertido:", num);
      return isNaN(num) ? "0.00" : num;
    })
    .refine(val => Number(val) > 0, { message: "O valor deve ser maior que zero." })
});

type CadastroDespesaSchema = z.infer<typeof cadastroDespesaSchema>;

export default function CadastroDespesa() {
  const { user } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tiposPasseio, setTiposPasseio] = useState<GetTipoDespesaDto[]>([]);
  const route = useRoute<CadastroDespesaRouteProp>();
  const { viagem } = route.params;
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<CadastroDespesaSchema>({
    resolver: zodResolver(cadastroDespesaSchema),
    defaultValues: {
      descricao: "",
      tipoDespesa: "",
      data: "",
      valor: "0.00"
    },
  });

  function onFormValidationError(errors: any) {
    // Mostra um Toast geral informando que há erros
    Toast.show({
      type: "error",
      text1: "Erro na validação",
      text2: "Por favor, preencha os campos corretamente.",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      position: "top",
      text1Style: {
        fontSize: 16, // Tamanho do texto principal
        fontWeight: "bold", // Negrito
      },
      text2Style: {
        fontSize: 16, // Tamanho do texto secundário
      },
    });
  
    // (Opcional) Exibir detalhes adicionais para depuração
    console.log("Erros de validação:", errors);
  }

  useEffect(() => {
    async function consultarTiposDespesa() {
      try {
        const response = await travelerApi.get<GetTipoDespesaDto[]>("/tipo-despesa");
        setTiposPasseio(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de despesa:", error);
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar os tipos de despesa.",
        });
      }
    }
    consultarTiposDespesa() 
  }, []);

  const cadastrarPasseio = async (data: CadastroDespesaSchema) => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Usuário não autenticado. Faça login novamente.",
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      return;
    }

    try {
      const dataFormatada = formatToISOString(data.data);
      const payloadDespesa = {
        descricao: data.descricao,
        tipo_id: Number(data.tipoDespesa),
        data: dataFormatada,
        valor: Number(data.valor),
        viagem_id: viagem.id,
        usuario_id: Number(user.id),
      };
      console.log("Payload da despesa:", payloadDespesa);

      const response = await cadastrarDespesaBanco(payloadDespesa);

      // Verifique se a resposta é do tipo erro
      if (response && 'status' in response && Number(response.status) >= 400) {
        // Aqui sabemos que o response é do tipo ErroResponseDto ou similar indicando falha
        throw new Error(`Erro ao cadastrar despesa: Código: ${response.statusCode} Erro: ${response.message || JSON.stringify(response)}`);
      }

      Toast.show({
        type: "success",
        text1: 'Cadastro realizado com sucesso',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        position: 'top',
        text1Style: {
          fontSize: 16, // Aumenta o tamanho da fonte para o texto principal
          fontWeight: 'bold', // Torna o texto principal em negrito
        },
        text2Style: {
          fontSize: 16, // Aumenta o tamanho da fonte para o texto secundário
        },
        onPress: () => {
          Toast.hide();
        }
      });

      // Resetar o formulário para os valores padrão APÓS o sucesso
      reset({
        descricao: "",
        tipoDespesa: "",
        data: "",
        valor: "0.00"
      });

      // navegue para ViagemSelecionada e redefina a pilha.
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0, // O índice da rota ativa na nova pilha. 0 significa a primeira rota.
            routes: [
              { 
                name: 'Viagens' // Nome da rota para a tela de listagem de viagens
              },
              { 
                name: 'ViagemSelecionada', // Nome da rota para a tela de detalhes da viagem
                params: { viagem } // Parâmetros da viagem selecionada
              },
            ],
          })
        );
      }, 1000);

    } catch (error: any) {
      console.error("Erro ao cadastrar despesa: ", error);
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar",
          text2: error.message || "Ocorreu um erro ao salvar o despesa.",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          position: "top",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 16 },
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderFixo />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Titulo texto="Nova Despesa" />
            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Descrição da Despesa"
                  placeholder="Digite a descrição da Despesa"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.descricao && <Text style={styles.error} >{errors.descricao.message}</Text>}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Selecione o tipo de despesa</Text>
              <View style={styles.containerInput}>
              <Controller
                name="tipoDespesa"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                  >
                    <Picker.Item label="Selecione o tipo de despesa" value="1" />
                    {tiposPasseio.map((item) => (
                      <Picker.Item key={item.id} value={item.id} label={item.descricao} />
                    ))}
                  </Picker>
                )}
              />
            </View>
            {errors.tipoDespesa && <Text style={styles.error} >{errors.tipoDespesa.message}</Text>}
            </View>
            <InputValor label="Valor" name="valor" control={control}/>
            {errors.valor && <Text style={styles.error} >{errors.valor.message}</Text>}
            <Controller
              control={control}
              name="data"
              render={({ field: { onChange, onBlur, value } }) => (
                <DateInput
                  label="Data do Passeio"
                  placeholder="__/__/__"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.data && <Text style={styles.error} >{errors.data.message}</Text>}
            <Botao label="Continuar" onPress={handleSubmit(cadastrarPasseio, onFormValidationError)} />
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}