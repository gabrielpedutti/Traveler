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
import { atualizarHospedagemBanco, atualizarTransporteBanco } from "../../services/httpService";
import { CadastroContext } from "../../contexts/cadastro";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EditarHospedagemRouteProp, RootStackParamList } from "../../types/RootStackParamList";
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import travelerApi from "../../services/api/travelerApi";
import { SafeAreaView } from "react-native-safe-area-context";
import GetTipoTransporteDto from "../../types/dto/GetTipoTransporteDto";
import { deleteLocalDocument, pickAndSaveDocument } from "../../utils/fileUploadUtils";
import BotaoAnexarArquivo from "../../components/BotaoAnexarArquivo";
import { InputValor } from "../../components/InputValor";
import { LocationsIdResponseDto } from "../../types/dto/LocationsIdResponseDto";
import EditarHospedagemRequestDto from "../../types/dto/EditarHospedagemRequestDto";

const editarHospedagemSchema = z.object({
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
  data_checkin: z.string().min(1, "Data é obrigatório"),
  data_checkout: z.string().min(1, "Data é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  documentPath: z.string().optional(), // Campo para armazenar o URI local
  documentName: z.string().optional(), // Campo opcional para exibir o nome original
})

type EditarHospedagemSchema = z.infer<typeof editarHospedagemSchema>;

function EditarHospedagem() {

  const { user } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tipoHospedagem, setTipoTransporte] = useState<GetTipoTransporteDto[]>([]);
  const route = useRoute<EditarHospedagemRouteProp>();
  const { hospedagem, viagem } = route.params;
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const [localTransporte, setlocalTransporte] = useState<LocationsIdResponseDto>();

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<EditarHospedagemSchema>({
    resolver: zodResolver(editarHospedagemSchema),
    defaultValues: {
      nome: hospedagem.nome || "",
      tipoHospedagem: hospedagem.tipo_id || 0,
      valor: hospedagem.despesa.valor ? hospedagem.despesa.valor.toString() : "0.00",
      data_checkin: hospedagem.data_checkin ? formatDate(hospedagem.data_checkin) : "",
      data_checkout: hospedagem.data_checkout ? formatDate(hospedagem.data_checkout) : "",
      endereco: hospedagem.endereco || "",
      documentPath: hospedagem.documento_anexo || undefined,
      documentName: hospedagem.documento_anexo ? hospedagem.documento_anexo.split('/').pop() : undefined,
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

  // Efeito para carregar os tipos de hospedagem
  useEffect(() => {
    const consultarTiposHospedagem = async () => {
      try {
        const response = await travelerApi.get('/tipo-hospedagem');
        setTipoTransporte(response.data);
      } catch (error) {
         console.error("Erro ao buscar tipos de hospedagem:", error);
         Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível carregar os tipos de hospedagem.",
         });
      }
    }
    consultarTiposHospedagem();
  }, []);      

  async function atualizarHospedagem(data: EditarHospedagemSchema) {

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
      const dataCheckinFormatada = formatToISOString(data.data_checkin);
      const dataCheckoutFormatada = formatToISOString(data.data_checkout);

      const payloadViagem: EditarHospedagemRequestDto = {
        ...data,
        id: hospedagem.id,
        tipo_id: Number(data.tipoHospedagem),
        valor: Number(data.valor),
        viagem_id: Number(hospedagem.viagem_id),
        data_checkin: dataCheckinFormatada,
        data_checkout: dataCheckoutFormatada,
        endereco: data.endereco,
        documento_anexo: data.documentPath || "",
        despesa_id: hospedagem.despesa_id,
        usuario_id: hospedagem.usuario_id,
      }

      console.log("Payload para atualizar hospedagem:", payloadViagem);

      const response = await atualizarHospedagemBanco(payloadViagem);

      // Verifique se a resposta é do tipo erro
      if (response && 'status' in response && Number(response.status) >= 400) {
        // Aqui sabemos que o response é do tipo ErroResponseDto ou similar indicando falha
        throw new Error(`Erro ao cadastrar hospedagem: Código: ${response.statusCode} Erro: ${response.message || JSON.stringify(response)}`);
      }

      // Se o usuário removeu o anexo, vamos deletar o arquivo local
      if (!data.documentPath && hospedagem.documento_anexo) {
        handleDeletarAnexoButton();
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
      console.error("Erro ao cadastrar hospedagem: ", error);
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar",
          text2: error.message || "Ocorreu um erro ao salvar o hospedagem.",
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
        <Titulo texto="Editar hospedagem" />
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
          <InputValor label="Valor" name="valor" control={control}/>
          {errors.valor && <Text style={styles.error} >{errors.valor.message}</Text>}
          <View style={styles.containerDatas}>
            <View style={styles.containerData}>
              <Controller
                control={control}
                name="data_checkin"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DateInput
                    defaultValue={hospedagem.data_checkin ? formatDate(hospedagem.data_checkin) : ""}
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
                    defaultValue={hospedagem.data_checkout ? formatDate(hospedagem.data_checkout) : ""}
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
          <Botao label="Confirmar" onPress={handleSubmit(atualizarHospedagem, onFormValidationError)} />
        </ScrollView>
        <Toast />
      </KeyboardAvoidingView>
    </View>
  </SafeAreaView>
  )
}

export default EditarHospedagem;

