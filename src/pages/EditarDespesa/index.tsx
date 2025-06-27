import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from "react-native";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import Input from "../../components/InputCadastro";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "../../components/DateInput";
import Botao from "../../components/Botao";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import HeaderFixo from "../../components/HeaderFixo";
import { useContext, useEffect, useState } from "react";
import { formatDate, formatToISOString } from "../../utils/DataFormat";
import { atualizarDespesaBanco, atualizarHospedagemBanco, atualizarTransporteBanco } from "../../services/httpService";
import { CadastroContext } from "../../contexts/cadastro";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EditarDespesaRouteProp, RootStackParamList } from "../../types/RootStackParamList";
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import travelerApi from "../../services/api/travelerApi";
import { SafeAreaView } from "react-native-safe-area-context";
import GetTipoTransporteDto from "../../types/dto/GetTipoTransporteDto";
import { deleteLocalDocument, pickAndSaveDocument } from "../../utils/fileUploadUtils";
import BotaoAnexarArquivo from "../../components/BotaoAnexarArquivo";
import { InputValor } from "../../components/InputValor";
import { LocationsIdResponseDto } from "../../types/dto/LocationsIdResponseDto";
import EditarDespesaRequestDto from "../../types/dto/EditarDespesaRequestDto";

const editarHospedagemSchema = z.object({
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
      let num = 0;
      if(isNaN(Number(val))) {
        num = parseFloat(val.replace(/[R$\s.]/g, '').replace(',', '.'));
        console.log("Valor transformado:", num);
      } else {
        num = parseFloat(val)
      }
      return isNaN(num) ? "0.00" : num.toFixed(2);
    })
    .refine(val => Number(val) > 0, { message: "O valor deve ser maior que zero." }),
});

type EditarDespesaSchema = z.infer<typeof editarHospedagemSchema>;

function EditarDespesa() {

  const { user } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tipoDespesa, setTipoDespesa] = useState<GetTipoTransporteDto[]>([]);
  const route = useRoute<EditarDespesaRouteProp>();
  const { despesa, viagem } = route.params;

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<EditarDespesaSchema>({
    resolver: zodResolver(editarHospedagemSchema),
    defaultValues: {
      descricao: despesa.descricao || "",
      tipoDespesa: despesa.tipo_despesa_id || 0,
      valor: despesa.valor ? despesa.valor.toString() : "0.00",
      data: despesa ? formatDate(despesa.data) : "",
    }
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

  // Efeito para carregar os tipos de despesa
  useEffect(() => {
    const consultarTiposHospedagem = async () => {
      try {
        const response = await travelerApi.get('/tipo-despesa');
        setTipoDespesa(response.data);
      } catch (error) {
         console.error("Erro ao buscar tipos de despesa:", error);
         Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível carregar os tipos de despesa.",
         });
      }
    }
    consultarTiposHospedagem();
  }, []);      

  async function atualizarDespesa(data: EditarDespesaSchema) {

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

      const payloadViagem: EditarDespesaRequestDto = {
        ...data,
        id: despesa.id,
        tipo_id: Number(data.tipoDespesa),
        valor: Number(data.valor),
        data: dataFormatada,
        usuario_id: Number(user.id),
        viagem_id: viagem.id,
      }

      console.log("Payload para atualizar despesa:", payloadViagem);

      const response = await atualizarDespesaBanco(payloadViagem);

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
        valor: "0,00",
        data: ""
      });

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
      });

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
  }

  return(
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
                    {tipoDespesa.map((item) => (
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
                  defaultValue={despesa.data ? formatDate(despesa.data) : ""}
                  label="Data da despesa"
                  placeholder="__/__/__"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.data && <Text style={styles.error} >{errors.data.message}</Text>}
            <Botao label="Continuar" onPress={handleSubmit(atualizarDespesa, onFormValidationError)} />
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default EditarDespesa;

