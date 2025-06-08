import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, Platform } from "react-native";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import Input from "../../components/InputCadastro";
import { Controller, useForm } from "react-hook-form";
import SelecionarPaisEstadoCidade from "../../components/SelecionarPaisEstadoCidade";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "../../components/DateInput";
import Botao from "../../components/Botao";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import HeaderFixo from "../../components/HeaderFixo";
import { useContext, useEffect, useState } from "react";
import { CadastroViagemContext } from "../../contexts/cadastroViagem";
import { formatToISOString } from "../../utils/DataFormat";
import { cadastrarDespesaBanco, cadastrarTransporteBanco } from "../../services/httpService";
import { CadastroContext } from "../../contexts/cadastro";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CadastroTransporteRouteProp, RootStackParamList } from "../../types/RootStackParamList";
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import travelerApi from "../../services/api/travelerApi";
import { SafeAreaView } from "react-native-safe-area-context";
import BotaoSecundario from "../../components/BotaoSecundario";
import GetTipoTransporteDto from "../../types/dto/GetTipoTransporteDto";
import CadastroTransporteRequestDto from "../../types/dto/CadastroTransporteRequestDto";
import { deleteLocalDocument, pickAndSaveDocument } from "../../utils/fileUploadUtils";
import BotaoAnexarArquivo from "../../components/BotaoAnexarArquivo";
import { formatarParaReal } from "../../utils/CurrencyFormat";

const cadastroTrasnporteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipoTransporte:   z.union([z.string(), z.number()]) // Aceita tanto string quanto número
  .refine((val) => !isNaN(Number(val)), { message: "Tipo de transporte é obrigatório" }) // Verifica se é um número válido
  .transform((val) => {
    // Se for string (iOS), converte para número, se já for número (Android), deixa como está
    return Platform.OS === 'ios' ? Number(val) : val;
  })
  .refine((val) => Number(val) > 0, { message: "Tipo de transporte é obrigatório" }),
  valor: z.string()
    .min(1, "O valor é obrigatório.")
    .transform((val) => {
      const cleanedValue = val.replace(/[R$\s.]/g, '').replace(',', '.');
      const num = parseFloat(cleanedValue);
      return isNaN(num) ? "0" : num.toString();
    })
    .refine(val => Number(val) > 0, { message: "O valor deve ser maior que zero." }),
  data: z.string().min(1, "Data é obrigatório"),
  viagem_destino: z
    .union([z.string(), z.number()]) // Aceita tanto string quanto número
    .refine((val) => !isNaN(Number(val)), { message: "Destino é obrigatório" }) // Verifica se é um número válido
    .transform((val) => {
      // Se for string (iOS), converte para número, se já for número (Android), deixa como está
      return Platform.OS === 'ios' ? Number(val) : val;
    })
    .refine((val) => Number(val) > 0, { message: "Destino é obrigatório" }),
  documentPath: z.string().optional(), // Campo para armazenar o URI local
  documentName: z.string().optional(), // Campo opcional para exibir o nome original
})

type CadastroTransporteSchema = z.infer<typeof cadastroTrasnporteSchema>;

function CadastroTransporte() {

  const { user } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tipoTransporte, setTipoTransporte] = useState<GetTipoTransporteDto[]>([]);
  const route = useRoute<CadastroTransporteRouteProp>();
  const { isCreatingViagem, viagem } = route.params;
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<CadastroTransporteSchema>({
    resolver: zodResolver(cadastroTrasnporteSchema),
    defaultValues: {
      nome: "",
      tipoTransporte: "",
      valor: "0.00",
      data: "",
      viagem_destino: 0,
      documentPath: undefined,
      documentName: undefined,
    }
  });

  // Use watch para obter o valor atual de documentName para exibição
  const attachedDocumentName = watch('documentName');

  // Função para lidar com o clique no botão "Anexar Comprovante"
  const handleAttachDocument = async () => {
    // Permite PDF e qualquer tipo de imagem
    const result = await pickAndSaveDocument(['application/pdf', 'image/*']);
    if (result) {
        // Atualiza o campo do formulário com o caminho local e nome
        setValue('documentPath', result.localUri);
        setValue('documentName', result.fileName);
        // Opcional: Exibir um toast de sucesso "Arquivo anexado: NomeArquivo.pdf"
    }
    setIsLoadingUploads(false);
  };

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

  // Efeito para carregar os tipos de transporte
  useEffect(() => {
    const consultaTiposTransporte = async () => {
      try {
        const response = await travelerApi.get('/tipo-transporte');
        setTipoTransporte(response.data);
      } catch (error) {
         console.error("Erro ao buscar tipos de transporte:", error);
         Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível carregar os tipos de transporte.",
         });
      }
    }
    consultaTiposTransporte();
  }, []);

  async function cadastrarTransporte(data: CadastroTransporteSchema) {

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

      const payloadViagem: CadastroTransporteRequestDto = {
        ...data,
        tipo_id: Number(data.tipoTransporte),
        valor: Number(data.valor),
        viagem_id: Number(viagem.id),
        data: dataFormatada,
        transporte_destino_id: Number(data.viagem_destino),
        documento_anexo: data.documentPath || ""
      }

      const response = await cadastrarTransporteBanco(payloadViagem);

      // Verifique se a resposta é do tipo erro
      if (response && 'status' in response && Number(response.status) >= 400) {
        // Aqui sabemos que o response é do tipo ErroResponseDto ou similar indicando falha
        throw new Error(`Erro ao cadastrar transporte: Código: ${response.statusCode} Erro: ${response.message || JSON.stringify(response)}`);
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
        nome: "",
        tipoTransporte: 0,
        data: "", // Ou um valor padrão que seu DateInput aceite para "limpar"
        valor: "0.00",
        documentPath: undefined,
        documentName: undefined,
      });
      
      setValue('documentPath', undefined); 
      setValue('documentName', undefined); 

      if (isCreatingViagem) {
        setTimeout(() => {
            navigation.navigate("CadastroHospedagem", {
              isCreatingViagem: true,
              viagem
            });
          }, 1000);
      } else {
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
      }

    } catch (error: any) {
      console.error("Erro ao cadastrar transporte: ", error);
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar",
          text2: error.message || "Ocorreu um erro ao salvar o transporte.",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          position: "top",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 16 },
        });
    }
  }

  async function handleDeletarAnexoButton() {
    const currentDocumentPath = getValues('documentPath');
    
    setValue('documentPath', undefined); 
    setValue('documentName', undefined); 
    if (currentDocumentPath) {
      await deleteLocalDocument(currentDocumentPath);
    }
  }

  return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderFixo />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Titulo texto="Novo transporte" />
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome do Transporte"
                  placeholder="Digite o nome do Transporte"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.nome && <Text style={styles.error} >{errors.nome.message}</Text>}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Selecione o tipo de transporte</Text>
              <View style={styles.containerInput}>
              <Controller
                name="tipoTransporte"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                  >
                    <Picker.Item label="Selecione o tipo de transporte" value="1" />
                    {tipoTransporte.map((item) => (
                      <Picker.Item key={item.id} value={item.id} label={item.descricao} />
                    ))}
                  </Picker>
                )}
              />
            </View>
            {errors.tipoTransporte && <Text style={styles.error} >{errors.tipoTransporte.message}</Text>}
            </View>
            <Controller
              control={control}
              name="valor"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Valor"
                  keyboardType="numeric"
                  placeholder="0.00"
                  onChangeText={(text) => {

                    let cleanedText = text.replace(/[^0-9.,]/g, '');
                    cleanedText = cleanedText.replace(/,/g, '.');
                    const parts = cleanedText.split('.');
                    if (parts.length > 2) {
                        cleanedText = parts[0] + '.' + parts.slice(1).join('');
                    }
                    if (cleanedText.includes('.')) {
                        const [integerPart, decimalPart] = cleanedText.split('.');
                        if (decimalPart.length > 2) {
                            cleanedText = integerPart + '.' + decimalPart.substring(0, 2);
                        }
                    }
                    onChange(cleanedText);
                  }}
                  value={value}
                />
              )}
            />
            {errors.valor && <Text style={styles.error} >{errors.valor.message}</Text>}
            <Controller
              control={control}
              name="data"
              render={({ field: { onChange, onBlur, value } }) => (
                <DateInput
                  label="Data do Transporte"
                  placeholder="__/__/__"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.data && <Text style={styles.error} >{errors.data.message}</Text>}
            <Text style={styles.titulo}>Selecione o Destino</Text>
            <SelecionarPaisEstadoCidade municipioName={"viagem_destino"} control={control} errors={errors} />
            <BotaoAnexarArquivo 
              handleAttachDocument={handleAttachDocument} 
              handleDeletarAnexoButton={handleDeletarAnexoButton}
              label="Anexar Comprovante"
              attachedDocumentName={attachedDocumentName || ""}
            />
            
            {isCreatingViagem ? 
            (
            <View style={styles.containerButton}>
              <BotaoSecundario label="Pular" onPress={() => navigation.navigate("CadastroHospedagem", { isCreatingViagem: true, viagem })} />
              <Botao label="Continuar" onPress={handleSubmit(cadastrarTransporte, onFormValidationError)} />
            </View>
            )
            :
            (
              <Botao label="Continuar" onPress={handleSubmit(cadastrarTransporte, onFormValidationError)} />
            )}
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default CadastroTransporte;

