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
import { useContext } from "react";
import { CadastroContext } from "../../contexts/cadastro";
import { cadastrarViagemBanco } from "../../services/httpService";
import Toast from "react-native-toast-message";
import { ErroResponseDto } from "../../types/dto/ErroResponseDto";

const cadastroViagemSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatório"),
  data_inicio: z.string().min(1, "Data Inicial é obrigatório"),
  data_fim: z.string().min(1, "Data Final é obrigatório"),
  viagem_origem: z
    .union([z.string(), z.number()]) // Aceita tanto string quanto número
    .refine((val) => !isNaN(Number(val)), { message: "Origem é obrigatório" }) // Verifica se é um número válido
    .transform((val) => {
      // Se for string (iOS), converte para número, se já for número (Android), deixa como está
      return Platform.OS === 'ios' ? Number(val) : val;
    })
    .refine((val) => Number(val) > 0, { message: "Origem é obrigatório" }),
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

  const { control, handleSubmit, formState: { errors } } = useForm<CadastroViagemSchema>({
    resolver: zodResolver(cadastroViagemSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      data_inicio: '',
      data_fim: '',
      viagem_origem: 0,
      viagem_destino: 0
    }
  });

  async function cadastrarViagem(data: CadastroViagemSchema) {

    console.log("AAAAAAAAAAAAAAAAAAAAAAA")
    console.log(data.data_inicio)
    console.log(data.viagem_destino)

    const dataInicioFormatada = formatToISOString(data.data_inicio);
    const dataFimFormatada = formatToISOString(data.data_fim);
    const payload: CadastroViagemRequestDto = {
      ...data,
      data_inicio: dataInicioFormatada,
      data_fim: dataFimFormatada,
      viagem_origem_id: Number(data.viagem_origem),
      viagem_destino_id: Number(data.viagem_destino),
      status_viagem_id: 5, //5-Planejada 6-Em andamento 7-Concluída 8-Cancelada
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
    if ((response as ErroResponseDto).status) {
      // Aqui sabemos que o response é do tipo ErroResponseDto
      throw response;
    }
  
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
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.noImage}>
            <FontAwesome6 name={'image'} size={40} color='#000' style={styles.icon}/>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name={'edit'} size={40} color='#000' style={styles.icon}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.titulo}>Nova Viagem</Text>
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
            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Descrição"
                  placeholder="Descreva a viagem"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.descricao && <Text style={styles.error} >{errors.descricao.message}</Text>}
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
          <Text style={styles.titulo}>Selecione a Origem</Text>
          <SelecionarPaisEstadoCidade municipioName={"viagem_origem"} control={control} errors={errors} />
          <Text style={styles.titulo}>Selecione o Destino</Text>
          <SelecionarPaisEstadoCidade municipioName={"viagem_destino"} control={control} errors={errors} />
          <Botao label="Cadastrar" onPress={handleSubmit(cadastrarViagem, onFormValidationError)} />
        </ScrollView>
        <Toast />
      </KeyboardAvoidingView>
    </View>
  )
}

export default CadastroViagem;

