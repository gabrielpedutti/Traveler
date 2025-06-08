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
import BotaoSecundario from "../../components/BotaoSecundario";
import { useEffect, useState } from "react";
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CadastroHospedagemRouteProp, CadastroTransporteRouteProp, RootStackParamList } from "../../types/RootStackParamList";
import GetTipoHospedagemDto from "../../types/dto/GetTipoHospedagemDto";
import { deleteLocalDocument, pickAndSaveDocument } from "../../utils/fileUploadUtils";
import BotaoAnexarArquivo from "../../components/BotaoAnexarArquivo";
import travelerApi from "../../services/api/travelerApi";
import { formatToISOString } from "../../utils/DataFormat";
import { cadastrarHospedagemBanco } from "../../services/httpService";

const cadastroHospedagemSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipoHospedagem:   z.union([z.string(), z.number()]) // Aceita tanto string quanto número
  .refine((val) => !isNaN(Number(val)), { message: "Tipo de hospedagem é obrigatório" }) // Verifica se é um número válido
  .transform((val) => {
    // Se for string (iOS), converte para número, se já for número (Android), deixa como está
    return Platform.OS === 'ios' ? Number(val) : val;
  })
  .refine((val) => Number(val) > 0, { message: "Tipo de hospedagem é obrigatório" }),
 valor: z.string()
    .min(1, "O valor é obrigatório.")
    .transform((val) => {
      const cleanedValue = val.replace(/[R$\s.]/g, '').replace(',', '.');
      const num = parseFloat(cleanedValue);
      return isNaN(num) ? "0" : num.toString();
    })
    .refine(val => Number(val) > 0, { message: "O valor deve ser maior que zero." }),
  data_checkin: z.string().min(1, "Data é obrigatório"),
  data_checkout: z.string().min(1, "Data é obrigatório"),
  // localHospedagem: z
  //   .union([z.string(), z.number()]) // Aceita tanto string quanto número
  //   .refine((val) => !isNaN(Number(val)), { message: "Origem é obrigatório" }) // Verifica se é um número válido
  //   .transform((val) => {
  //     // Se for string (iOS), converte para número, se já for número (Android), deixa como está
  //     return Platform.OS === 'ios' ? Number(val) : val;
  //   })
  //   .refine((val) => Number(val) > 0, { message: "Origem é obrigatório" }),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  documentPath: z.string().optional(), // Campo para armazenar o URI local
  documentName: z.string().optional(), // Campo opcional para exibir o nome original
})

type CadastroHospedagemSchema = z.infer<typeof cadastroHospedagemSchema>;

function CadastroHospedagem() {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tipoHospedagem, setTipoHospedagem] = useState<GetTipoHospedagemDto[]>([]);
  const route = useRoute<CadastroHospedagemRouteProp>();
  const { isCreatingViagem, viagem } = route.params;
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<CadastroHospedagemSchema>({
    resolver: zodResolver(cadastroHospedagemSchema),
    defaultValues: {
      nome: "",
      tipoHospedagem: "",
      valor: "0,00",
      data_checkin: "",
      data_checkout: "",
      // localHospedagem: 0,
      endereco: "",
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

  // Effect para carregar os tipos de hospedagem
  useEffect(() => {
    const consultarTiposHospedagem = async () => {
      try {
        const response = await travelerApi.get('/tipo-hospedagem');
        setTipoHospedagem(response.data);
      } catch (error) {
         console.error("Erro ao buscar tipos de hospedagens:", error);
         Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível carregar os tipos de hospedagens.",
         });
      }
    }
    consultarTiposHospedagem();
  }, []);

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

  async function cadastrarHospedagem(data: CadastroHospedagemSchema) {
    try {
      const dataCheckinFormatada = formatToISOString(data.data_checkin);
      const dataCheckoutFormatada = formatToISOString(data.data_checkout);

      const payloadHospedagem = {
        nome: data.nome,
        tipo_id: Number(data.tipoHospedagem),
        data_checkin: dataCheckinFormatada,
        data_checkout: dataCheckoutFormatada,
        valor: Number(data.valor),
        viagem_id: viagem.id,
        endereco: data.endereco,
        documento_anexo: data.documentPath || "",
      }      

      const response = await cadastrarHospedagemBanco(payloadHospedagem);

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
        tipoHospedagem: "",
        valor: "0,00",
        data_checkin: "",
        data_checkout: "",
        endereco: "",
        documentPath: undefined,
        documentName: undefined,
      });
      
      setValue('documentPath', undefined); 
      setValue('documentName', undefined); 

      if (isCreatingViagem) {
        setTimeout(() => {
            navigation.navigate("CadastroTurismo", {
              isCreatingViagem: true, viagem
            });
          }, 1000);
      } else {
        // Se não estiver criando a viagem (edição ou adição avulsa),
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
      console.error("Erro ao cadastrar a hospedagem: ", error);
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar",
          text2: error.message || "Ocorreu um erro ao salvar a hospedagem.",
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
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
          <Titulo texto="Nova hospedagem" />
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome da Hospedagem"
                  placeholder="Digite o nome da Hospedagem"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.nome && <Text style={styles.error} >{errors.nome.message}</Text>}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Selecione o tipo de hospedagem</Text>
              <View style={styles.containerInput}>
                <Controller
                  name="tipoHospedagem"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue) => onChange(itemValue)}
                    >
                      <Picker.Item label="Selecione o tipo de hospedagem" value="" />
                      {tipoHospedagem.map((item) => (
                        <Picker.Item key={item.id} value={item.id} label={item.descricao} />
                      ))}
                    </Picker>
                  )}
                />
              </View>
              {errors.tipoHospedagem && <Text style={styles.error} >{errors.tipoHospedagem.message}</Text>}
            </View>
            <Controller
              control={control}
              name="endereco"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Endereço"
                  placeholder="Digite o endereço da Hospedagem"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.endereco && <Text style={styles.error} >{errors.endereco.message}</Text>}
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
            <View style={styles.containerDatas}>
              <View style={styles.containerData}>
                <Controller
                  control={control}
                  name="data_checkin"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DateInput
                      label="Data do Check-in"
                      placeholder="__/__/__"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.data_checkin && <Text style={styles.error} >{errors.data_checkin.message}</Text>}
              </View>
              <View style={styles.containerData}>
                <Controller
                  control={control}
                  name="data_checkout"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DateInput
                      label="Data do Check-out"
                      placeholder="__/__/__"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.data_checkout && <Text style={styles.error} >{errors.data_checkout.message}</Text>}
              </View>
            </View>
            
            <BotaoAnexarArquivo 
              handleAttachDocument={handleAttachDocument} 
              handleDeletarAnexoButton={handleDeletarAnexoButton}
              label="Anexar Comprovante"
              attachedDocumentName={attachedDocumentName || ""}
            />
            {isCreatingViagem ? 
            (
            <View style={styles.containerButton}>
              <BotaoSecundario label="Pular" onPress={() => navigation.navigate("CadastroTurismo", { isCreatingViagem: true, viagem })} />
              <Botao label="Continuar" onPress={handleSubmit(cadastrarHospedagem, onFormValidationError)} />
            </View>
            )
            :
            (
              <Botao label="Continuar" onPress={handleSubmit(cadastrarHospedagem, onFormValidationError)} />
            )}
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default CadastroHospedagem;

