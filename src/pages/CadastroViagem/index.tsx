import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { styles } from "./styles";
import Input from "../../components/InputCadastro";
import { DateInput } from "../../components/DateInput";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelecionarPaisEstadoCidade from "../../components/SelecionarPaisEstadoCidade";
import Botao from "../../components/Botao";
import { formatToISO, formatToISOString } from "../../utils/DataFormat";
import { useContext, useEffect } from "react";
import { CadastroContext } from "../../contexts/cadastro";
import { cadastrarViagemBanco } from "../../services/httpService";
import Toast from "react-native-toast-message";
import { ErroResponseDto } from "../../types/dto/ErroResponseDto";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import Titulo from "../../components/Titulo";
import HeaderFixo from "../../components/HeaderFixo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { CadastroViagemContext } from "../../contexts/cadastroViagem";
import travelerApi from "../../services/api/travelerApi";
import { SafeAreaView } from "react-native-safe-area-context";

const cadastroViagemSchema = z.object({
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

type CadastroViagemSchema = z.infer<typeof cadastroViagemSchema>;

function CadastroViagem() {

  const { user } = useContext(CadastroContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { salvarDadosViagem } = useContext(CadastroViagemContext);

  const { control, handleSubmit, formState: { errors } } = useForm<CadastroViagemSchema>({
    resolver: zodResolver(cadastroViagemSchema),
    defaultValues: {
      nome: '',
      data_inicio: '',
      data_fim: '',
      viagem_destino: 0
    }
  });

  async function cadastrarViagem(data: CadastroViagemSchema) {

    const dataInicioFormatada = formatToISOString(data.data_inicio);
    const dataFimFormatada = formatToISOString(data.data_fim);
    const payload: CadastroViagemRequestDto = {
      ...data,
      data_inicio: dataInicioFormatada,
      data_fim: dataFimFormatada,
      viagem_destino_id: Number(data.viagem_destino),
      usuario_id: Number(user.id)
    }

    try {
      const response = await cadastrarViagemBanco(payload);

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

    // Verifique se a resposta é do tipo erro
    if ('status' in response) {
      // Aqui sabemos que o response é do tipo ErroResponseDto
      throw response;
    }

    // Busca a viagem cadastrada para salvar no contexto e disponibilizar para as próximas telas
    try {
      const viagem = await travelerApi.get(`/viagem/${response.id}`);
      salvarDadosViagem(viagem.data as GetViagemResponseDto);

      // Navega para a próxima tela após um pequeno atraso
      setTimeout(() => {
        navigation.navigate("CadastroTransporte", {
              isCreatingViagem: true
            });
      }, 1000); // Delay de 1 segundo
    } catch (error) {
      console.error("Erro ao salvar os dados da viagem no contexto:", error);
    }

    // Aguardar 4 segundos antes de mudar de página
    setTimeout(() => {
      navigation.navigate('CadastroTransporte', {
              isCreatingViagem: true
            });
    }, 1000); // Delay em milissegundos (1 segundos)
  
    } catch (error) {
      // Verifique se o erro é uma instância de ErroResponseDto
      const err = error as ErroResponseDto;
  
      // Mensagem de erro com Toast
      Toast.show({
        type: "error",
        text1: 'Ocorreu um erro ao cadastrar',
        text2: err.message || 'Erro desconhecido', // Acesse a mensagem diretamente
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
    }
  }

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

  return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderFixo />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.noImage}>
              <FontAwesome6 name={'image'} size={40} color='#000' style={styles.icon}/>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name={'edit'} size={40} color='#000' style={styles.icon}/>
              </TouchableOpacity>
            </View>
            <Titulo texto="Nova viagem" />
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
            <SelecionarPaisEstadoCidade municipioName={"viagem_destino"} control={control} errors={errors} />
            <Botao label="Continuar" onPress={handleSubmit(cadastrarViagem, onFormValidationError)} />
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default CadastroViagem;

