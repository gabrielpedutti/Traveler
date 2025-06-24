import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from "react-native";

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
import { formatDate, formatToISO, formatToISOString } from "../../utils/DataFormat";
import { atualizarTransporteBanco, atualizarViagemBanco, cadastrarDespesaBanco, cadastrarTransporteBanco } from "../../services/httpService";
import { CadastroContext } from "../../contexts/cadastro";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CadastroTransporteRouteProp, EditarTransporteRouteProp, EditarViagemRouteProp, RootStackParamList } from "../../types/RootStackParamList";
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
import EditarViagemRequestDto from "../../types/dto/EditarViagemRequestDto";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const editarViagemSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  data_inicio: z.string().min(1, "Data Inicial é obrigatório"),
  data_fim: z.string().min(1, "Data Final é obrigatório"),
  viagem_destino: z
    .union([z.string(), z.number()]) // Aceita tanto string quanto número
    .refine((val) => !isNaN(Number(val)), { message: "Destino é obrigatório" }) // Verifica se é um número válido
    .transform((val) => {
      // Se for string (iOS), converte para número, se já for número (Android), deixa como está
      return Platform.OS === 'ios' ? Number(val) : val;
    })
    .refine((val) => Number(val) > 0, { message: "Destino é obrigatório" }),
})
.refine((data) => {
  const inicio = formatToISO(data.data_inicio);
  const fim = formatToISO(data.data_fim);

  // Verifica se data_inicio é menor que data_fim
  return inicio < fim;
  },
  {
    message: "A data de início não pode ser maior que a data de fim.",
    path: ["data_inicio"], // Vincular erro ao campo `data_inicio`
  });

type EditarViagemSchema = z.infer<typeof editarViagemSchema>;

function EditarViagem() {

  const { user } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditarViagemRouteProp>();
  const { viagem } = route.params;
  const [localViagem, setlocalViagem] = useState<LocationsIdResponseDto>();

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<EditarViagemSchema>({
    resolver: zodResolver(editarViagemSchema),
    defaultValues: {
      nome: viagem.nome || "",
      data_inicio: viagem.data_inicio ? formatDate(viagem.data_inicio) : "",
      data_fim: viagem.data_fim ? formatDate(viagem.data_fim) : "",
      viagem_destino: viagem.viagem_destino_id || 0
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

    useEffect(() => {
    const buscarIdsLocalTransporte = async () => {
      try {
        const response = await travelerApi.get(`/locations/${viagem.viagem_destino_id}`);
        if (response) {
          console.log("IDs de local para a viagem:", response.data);
          setlocalViagem(response.data);
        } else {
          console.error("Nenhum ID de local encontrado para a viagem.");
          Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível carregar o destino da viagem.",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar IDs de local para a viagem:", error);
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar o destino da viagem.",
        });
      }
    };
    buscarIdsLocalTransporte();
  }, [viagem.viagem_destino_id]);

  async function atualizarViagem(data: EditarViagemSchema) {

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
      const dataInicioFormatada = formatToISOString(data.data_inicio);
      const dataFimFormatada = formatToISOString(data.data_fim);

      const payloadViagem: EditarViagemRequestDto = {
        id: viagem.id,
        ...data,
        usuario_id: Number(user.id),
        data_inicio: dataInicioFormatada,
        data_fim: dataFimFormatada,
        viagem_destino_id: Number(data.viagem_destino),
        status_viagem_id: viagem.status_viagem_id || 1,
      }

      console.log("Payload para atualizar viagem:", payloadViagem);

      const response = await atualizarViagemBanco(payloadViagem);

      // Verifique se a resposta é do tipo erro
      if (response && 'status' in response && Number(response.status) >= 400) {
        // Aqui sabemos que o response é do tipo ErroResponseDto ou similar indicando falha
        throw new Error(`Erro ao editar viagem: Código: ${response.statusCode} Erro: ${response.message || JSON.stringify(response)}`);
      }

      Toast.show({
        type: "success",
        text1: 'Edição realizada com sucesso',
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
      nome: '',
      data_inicio: '',
      data_fim: '',
      viagem_destino: 0
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
      console.error("Erro ao editar viagem: ", error);
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar",
          text2: error.message || "Ocorreu um erro ao salvar a viagem.",
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
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.noImage}>
              <FontAwesome6Icon name={'image'} size={40} color='#000' style={styles.icon}/>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name={'edit'} size={40} color='#000' style={styles.icon}/>
              </TouchableOpacity>
            </View>
            <Titulo texto="Editar viagem" />
            <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Nome da Viagem"
                    placeholder="Digite o nome da viagem"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
              {errors.nome && <Text style={styles.error} >{errors.nome.message}</Text>}
            <View style={styles.containerDatas}>
              <View  style={styles.containerData}>
                <Controller
                  control={control}
                  name="data_inicio"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DateInput
                      defaultValue={viagem.data_inicio ? formatDate(viagem.data_inicio) : ""}
                      label="Data da Viagem"
                      placeholder="__/__/__"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.data_inicio && <Text style={styles.error} >{errors.data_inicio.message}</Text>}
              </View>
              <View style={styles.containerData}>
                <Controller
                  control={control}
                  name="data_fim"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DateInput
                    defaultValue={viagem.data_fim ? formatDate(viagem.data_fim) : ""}
                      label="Data fim da Viagem"
                      placeholder="__/__/__"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.data_fim && <Text style={styles.error} >{errors.data_fim.message}</Text>}
              </View>
            </View>
            <Text style={styles.titulo}>Selecione o Destino</Text>
            <SelecionarPaisEstadoCidade municipioName={"viagem_destino"} control={control} errors={errors} locationIds={localViagem} />
            <Botao label="Confirmar" onPress={handleSubmit(atualizarViagem, onFormValidationError)} />
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default EditarViagem;

