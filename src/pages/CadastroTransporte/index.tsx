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
import { RootStackParamList } from "../../types/RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import travelerApi from "../../services/api/travelerApi";

const cadastroTrasnporteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipoTransporte:   z.union([z.string(), z.number()]) // Aceita tanto string quanto número
  .refine((val) => !isNaN(Number(val)), { message: "Tipo de tranpsorte é obrigatório" }) // Verifica se é um número válido
  .transform((val) => {
    // Se for string (iOS), converte para número, se já for número (Android), deixa como está
    return Platform.OS === 'ios' ? Number(val) : val;
  })
  .refine((val) => Number(val) > 0, { message: "Tipo de tranpsorte é obrigatório" }),
  valor: z.string().min(1, "Valor é obrigatório"),
  data: z.string().min(1, "Data é obrigatório"),
  viagem_destino: z
    .union([z.string(), z.number()]) // Aceita tanto string quanto número
    .refine((val) => !isNaN(Number(val)), { message: "Destino é obrigatório" }) // Verifica se é um número válido
    .transform((val) => {
      // Se for string (iOS), converte para número, se já for número (Android), deixa como está
      return Platform.OS === 'ios' ? Number(val) : val;
    })
    .refine((val) => Number(val) > 0, { message: "Destino é obrigatório" }),
})

type CadastroTransporteSchema = z.infer<typeof cadastroTrasnporteSchema>;

function CadastroTransporte() {

  const { user } = useContext(CadastroContext);
  const { viagem } = useContext(CadastroViagemContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tipoTransporte, setTipoTransporte] = useState<GetTipoTransporteDto[]>([]);

  const { control, handleSubmit, formState: { errors } } = useForm<CadastroTransporteSchema>({
    resolver: zodResolver(cadastroTrasnporteSchema),
    defaultValues: {
      nome: "",
      tipoTransporte: "",
      valor: "",
      data: "",
      viagem_destino: 0,
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
    const consultaPaises = async () => {
      const response = await travelerApi.get('/transporte/tipos');
      setTipoTransporte(response.data)
    }
    consultaPaises();
  }, [])

  async function cadastrarTransporte(data: CadastroTransporteSchema) {

    try {
      const dataFormatada = formatToISOString(data.data);
      // const payloadDespesa: CadastroDespesaRequestDto = {
      //   data: dataFormatada,
      //   descricao: "Transporte: " + data.nome,
      //   usuario_id: user.id ?? 0,
      //   valor: Number(data.valor),
      //   viagem_id: Number(viagem.id),
      //   tipo_despesa_id: 1, //1	TRANSPORTE  2 HOSPEDAGEM  3 ALIMENTACAO  4 PASSEIO  5 OUTROS
      // }

      // const responseDespesa = await cadastrarDespesaBanco(payloadDespesa);

      // // Verifique se a resposta é do tipo erro
      // if ('status' in responseDespesa) {
      //   // Aqui sabemos que o response é do tipo ErroResponseDto
      //   throw responseDespesa;
      // }

      const payloadViagem: CadastroTransporteRequestDto = {
        ...data,
        tipo_id: Number(data.tipoTransporte),
        despesa_id: responseDespesa.id,
        viagem_id: Number(viagem.id),
        data: dataFormatada,
        transporte_destino_id: Number(data.viagem_destino),
      }

      const response = await cadastrarTransporteBanco(payloadViagem);

      // Verifique se a resposta é do tipo erro
      if ('status' in response) {
        // Aqui sabemos que o response é do tipo ErroResponseDto
        throw response;
      }

      // Navega para a próxima tela após um pequeno atraso
      setTimeout(() => {
        navigation.navigate("CadastroHospedagem");
      }, 1000); // Delay de 1 segundo
    } catch (error) {
      console.error("Erro ao cadastrar transporte: ", error);
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

  }

  return(
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
                placeholder="Digite o valor"
                onChangeText={onChange}
                onBlur={onBlur}
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
          <Botao label="Continuar" onPress={handleSubmit(cadastrarTransporte, onFormValidationError)} />
        </ScrollView>
        <Toast />
      </KeyboardAvoidingView>
    </View>
  )
}

export default CadastroTransporte;

