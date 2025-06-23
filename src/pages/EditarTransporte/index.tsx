import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, Platform } from "react-native";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import Input from "../../components/InputCadastro";
import { Controller, useForm } from "react-hook-form";
import SelecionarPaisEstadoCidade from "../../components/SelecionarPaisEstadoCidade";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "../../components/DateInput";
import Botao from "../../components/Botao";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import HeaderFixo from "../../components/HeaderFixo";
import { use, useContext, useEffect, useState } from "react";
import { CadastroViagemContext } from "../../contexts/cadastroViagem";
import { formatDate, formatToISOString } from "../../utils/DataFormat";
import { atualizarTransporteBanco, cadastrarDespesaBanco, cadastrarTransporteBanco } from "../../services/httpService";
import { CadastroContext } from "../../contexts/cadastro";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CadastroTransporteRouteProp, EditarTransporteRouteProp, RootStackParamList } from "../../types/RootStackParamList";
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import travelerApi from "../../services/api/travelerApi";
import { SafeAreaView } from "react-native-safe-area-context";
import BotaoSecundario from "../../components/BotaoSecundario";
import GetTipoTransporteDto from "../../types/dto/GetTipoTransporteDto";
import { deleteLocalDocument, pickAndSaveDocument } from "../../utils/fileUploadUtils";
import BotaoAnexarArquivo from "../../components/BotaoAnexarArquivo";
import { formatarParaReal } from "../../utils/CurrencyFormat";
import { InputValor } from "../../components/InputValor";
import { LocationsIdResponseDto } from "../../types/dto/LocationsIdResponseDto";
import EditarTransporteRequestDto from "../../types/dto/EditarTransporteRequestDto";

const editarTransporteSchema = z.object({
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
      let num = 0;
      if(isNaN(Number(val))) {
        num = parseFloat(val.replace(/[R$\s.]/g, '').replace(',', '.'));
      } else {
        num = parseFloat(val)
      }
      return isNaN(num) ? "0.00" : num.toFixed(2);
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

type EditarTransporteSchema = z.infer<typeof editarTransporteSchema>;

function EditarTransporte() {

  const { user } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tipoTransporte, setTipoTransporte] = useState<GetTipoTransporteDto[]>([]);
  const route = useRoute<EditarTransporteRouteProp>();
  const { transporte, viagem } = route.params;
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const [localTransporte, setlocalTransporte] = useState<LocationsIdResponseDto>();

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<EditarTransporteSchema>({
    resolver: zodResolver(editarTransporteSchema),
    defaultValues: {
      nome: transporte.nome || "",
      tipoTransporte: transporte.tipo_id || 0,
      valor: transporte.despesa.valor ? transporte.despesa.valor.toString() : "0.00",
      data: transporte.data ? formatDate(transporte.data) : "",
      viagem_destino: transporte.transporte_destino_id || 0,
      documentPath: transporte.documento_anexo || undefined,
      documentName: transporte.documento_anexo ? transporte.documento_anexo.split('/').pop() : undefined,
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

  useEffect(() => {
    const buscarIdsLocalTransporte = async () => {
      try {
        const response = await travelerApi.get(`/locations/${transporte.transporte_destino_id}`);
        if (response) {
          console.log("IDs de local para o transporte:", response.data);
          setlocalTransporte(response.data);
        } else {
          console.error("Nenhum ID de local encontrado para o transporte.");
          Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível carregar o destino do transporte.",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar IDs de local para o transporte:", error);
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar o destino do transporte.",
        });
      }
    };
    buscarIdsLocalTransporte();
  }, [transporte.transporte_destino_id]);
        

  async function atualizarTransporte(data: EditarTransporteSchema) {

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

      const payloadViagem: EditarTransporteRequestDto = {
        ...data,
        id: transporte.id,
        tipo_id: Number(data.tipoTransporte),
        valor: Number(data.valor),
        viagem_id: Number(transporte.viagem_id),
        data: dataFormatada,
        transporte_destino_id: Number(data.viagem_destino),
        documento_anexo: data.documentPath || "",
        despesa_id: transporte.despesa_id,
      }

      console.log("Payload para atualizar transporte:", payloadViagem);

      const response = await atualizarTransporteBanco(payloadViagem);

      // Verifique se a resposta é do tipo erro
      if (response && 'status' in response && Number(response.status) >= 400) {
        // Aqui sabemos que o response é do tipo ErroResponseDto ou similar indicando falha
        throw new Error(`Erro ao cadastrar transporte: Código: ${response.statusCode} Erro: ${response.message || JSON.stringify(response)}`);
      }

      // Se o usuário removeu o anexo, vamos deletar o arquivo local
      if (!data.documentPath && transporte.documento_anexo) {
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
        tipoTransporte: 0,
        data: "", // Ou um valor padrão que seu DateInput aceite para "limpar"
        valor: "0.00",
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
            <Titulo texto="Editando transporte" />
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
            <InputValor label="Valor" name="valor" control={control}/>
            {errors.valor && <Text style={styles.error} >{errors.valor.message}</Text>}
            <Controller
              control={control}
              name="data"
              render={({ field: { onChange, onBlur, value } }) => (
                <DateInput
                  defaultValue={transporte.data ? formatDate(transporte.data) : ""}
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
            <SelecionarPaisEstadoCidade municipioName={"viagem_destino"} control={control} errors={errors} locationIds={localTransporte} />
            <BotaoAnexarArquivo 
              handleAttachDocument={handleAttachDocument} 
              handleDeletarAnexoButton={handleDeletarAnexoButton}
              label="Anexar Comprovante"
              attachedDocumentName={attachedDocumentName || ""}
            />
            
            <Botao label="Confirmar" onPress={handleSubmit(atualizarTransporte, onFormValidationError)} />
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default EditarTransporte;

