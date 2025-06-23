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
import { atualizarPasseioBanco } from "../../services/httpService";
import { CadastroContext } from "../../contexts/cadastro";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EditarPasseioRouteProp, RootStackParamList } from "../../types/RootStackParamList";
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import travelerApi from "../../services/api/travelerApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteLocalDocument, pickAndSaveDocument } from "../../utils/fileUploadUtils";
import BotaoAnexarArquivo from "../../components/BotaoAnexarArquivo";
import { InputValor } from "../../components/InputValor";
import GetTipoPasseioDto from "../../types/dto/GetTipoPasseioDto";
import EditarPasseioRequestDto from "../../types/dto/EditarPasseioRequestDto";

const editarPasseioSchema = z.object({
  nome: z.string().min(1, "O nome do passeio é obrigatório."),
  tipoPasseio:   z.union([z.string(), z.number()]) // Aceita tanto string quanto número
  .refine((val) => !isNaN(Number(val)), { message: "Tipo de passeio é obrigatório" }) // Verifica se é um número válido
  .transform((val) => {
    // Se for string (iOS), converte para número, se já for número (Android), deixa como está
    return Platform.OS === 'ios' ? Number(val) : val;
  })
  .refine((val) => Number(val) > 0, { message: "Tipo de passeio é obrigatório" }),
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
  documentPath: z.string().optional(), // Campo para armazenar o URI local
  documentName: z.string().optional(), // Campo opcional para exibir o nome original
});

type EditarPasseioSchema = z.infer<typeof editarPasseioSchema>;

function EditarPasseio() {

  const { user } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tiposPasseio, setTiposPasseio] = useState<GetTipoPasseioDto[]>([]);
  const route = useRoute<EditarPasseioRouteProp>();
  const { passeio, viagem } = route.params;
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<EditarPasseioSchema>({
    resolver: zodResolver(editarPasseioSchema),
    defaultValues: {
      nome: passeio.nome || "",
      tipoPasseio: passeio.tipo_id || 0,
      valor: passeio.despesa.valor ? passeio.despesa.valor.toString() : "0.00",
      data: passeio.data ? formatDate(passeio.data) : "",
      documentPath: passeio.documento_anexo || undefined,
      documentName: passeio.documento_anexo ? passeio.documento_anexo.split('/').pop() : undefined,
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

  // Efeito para carregar os tipos de passeio
  useEffect(() => {
    const consultarTiposPasseio = async () => {
      try {
        const response = await travelerApi.get('/tipo-passeio');
        setTiposPasseio(response.data);
      } catch (error) {
         console.error("Erro ao buscar tipos de passeio:", error);
         Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível carregar os tipos de passeio.",
         });
      }
    }
    consultarTiposPasseio();
  }, []);

  async function atualizarPasseio(data: EditarPasseioSchema) {

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

      const payloadViagem: EditarPasseioRequestDto = {
        ...data,
        id: passeio.id,
        tipo_id: Number(data.tipoPasseio),
        valor: Number(data.valor),
        viagem_id: Number(passeio.viagem_id),
        data: dataFormatada,
        documento_anexo: data.documentPath || "",
        despesa_id: passeio.despesa_id,
      }

      console.log("Payload para atualizar passeio:", payloadViagem);

      const response = await atualizarPasseioBanco(payloadViagem);

      // Verifique se a resposta é do tipo erro
      if (response && 'status' in response && Number(response.status) >= 400) {
        // Aqui sabemos que o response é do tipo ErroResponseDto ou similar indicando falha
        throw new Error(`Erro ao cadastrar passeio: Código: ${response.statusCode} Erro: ${response.message || JSON.stringify(response)}`);
      }

      // Se o usuário removeu o anexo, vamos deletar o arquivo local
      if (!data.documentPath && passeio.documento_anexo) {
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
        tipoPasseio: 0,
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
      console.error("Erro ao cadastrar passeio: ", error);
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar",
          text2: error.message || "Ocorreu um erro ao salvar o passeio.",
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
            <Titulo texto="Editar Passeio" />
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome do Passeio"
                  placeholder="Digite o nome do Passeio"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.nome && <Text style={styles.error} >{errors.nome.message}</Text>}
            <View style={styles.wrapper}>
              <Text style={styles.label}>Selecione o tipo de passeio</Text>
              <View style={styles.containerInput}>
              <Controller
                name="tipoPasseio"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                  >
                    <Picker.Item label="Selecione o tipo de passeio" value="1" />
                    {tiposPasseio.map((item) => (
                      <Picker.Item key={item.id} value={item.id} label={item.descricao} />
                    ))}
                  </Picker>
                )}
              />
            </View>
            {errors.tipoPasseio && <Text style={styles.error} >{errors.tipoPasseio.message}</Text>}
            </View>
            <InputValor label="Valor" name="valor" control={control}/>
            {errors.valor && <Text style={styles.error} >{errors.valor.message}</Text>}
            <Controller
              control={control}
              name="data"
              render={({ field: { onChange, onBlur, value } }) => (
                <DateInput
                  defaultValue={passeio.data ? formatDate(passeio.data) : ""}
                  label="Data do Passeio"
                  placeholder="__/__/__"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.data && <Text style={styles.error} >{errors.data.message}</Text>}
            <BotaoAnexarArquivo 
              handleAttachDocument={handleAttachDocument} 
              handleDeletarAnexoButton={handleDeletarAnexoButton}
              label="Anexar Comprovante"
              attachedDocumentName={attachedDocumentName || ""}
            />
            <Botao label="Confirmar" onPress={handleSubmit(atualizarPasseio, onFormValidationError)} />
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default EditarPasseio;

