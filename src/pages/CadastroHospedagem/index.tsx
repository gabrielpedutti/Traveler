import { View, Text, TextInput, Platform, KeyboardAvoidingView, ScrollView } from "react-native";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import Input from "../../components/InputCadastro";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { DateInput } from "../../components/DateInput";
import SelecionarPaisEstadoCidade from "../../components/SelecionarPaisEstadoCidade";
import Botao from "../../components/Botao";
import Toast from "react-native-toast-message";
import HeaderFixo from "../../components/HeaderFixo";
import { SafeAreaView } from "react-native-safe-area-context";
import BotaoSecundario from "../../components/BotaoSecundario";
import { useContext, useState } from "react";
import { CadastroContext } from "../../contexts/cadastro";
import { CadastroViagemContext } from "../../contexts/cadastroViagem";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CadastroTransporteRouteProp, RootStackParamList } from "../../types/RootStackParamList";
import GetTipoHospedagemDto from "../../types/dto/GetTipoHospedagemDto";

const cadastroHospedagemSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipoHospedagem: z.string().min(1, "Tipo de hospedagem é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  data_checkin: z.string().min(1, "Data é obrigatório"),
  data_checkout: z.string().min(1, "Data é obrigatório"),
  localHospedagem: z
    .union([z.string(), z.number()]) // Aceita tanto string quanto número
    .refine((val) => !isNaN(Number(val)), { message: "Origem é obrigatório" }) // Verifica se é um número válido
    .transform((val) => {
      // Se for string (iOS), converte para número, se já for número (Android), deixa como está
      return Platform.OS === 'ios' ? Number(val) : val;
    })
    .refine((val) => Number(val) > 0, { message: "Origem é obrigatório" }),
})

type CadastroHospedagemSchema = z.infer<typeof cadastroHospedagemSchema>;

function CadastroHospedagem() {

  const { user } = useContext(CadastroContext);
  const { viagem } = useContext(CadastroViagemContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tipoHospedagem, setTipoHospedagem] = useState<GetTipoHospedagemDto[]>([]);
  const route = useRoute<CadastroTransporteRouteProp>();
  const { isCreatingViagem } = route.params;

  const { control, handleSubmit, formState: { errors } } = useForm<CadastroHospedagemSchema>({
    resolver: zodResolver(cadastroHospedagemSchema),
    defaultValues: {
      nome: "",
      tipoHospedagem: "",
      valor: "",
      data_checkin: "",
      data_checkout: "",
      localHospedagem: 0,
    }
  });

  function onFormValidationError(errors: any) {
    console.log(errors);
  }

  async function cadastrarHospedagem(data: CadastroHospedagemSchema) {
    console.log(data);
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
                      {/* {cidades.map((item) => (
                        <Picker.Item key={item.id} value={item.id} label={item.nm_municipio} />
                      ))} */}
                    </Picker>
                  )}
                />
              </View>
              {errors.tipoHospedagem && <Text style={styles.error} >{errors.tipoHospedagem.message}</Text>}
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
            <Text style={styles.titulo}>Selecione o local da hospedagem</Text>
            <SelecionarPaisEstadoCidade municipioName={"localHospedagem"} control={control} errors={errors} />
            {isCreatingViagem ? 
            (
            <View style={styles.containerButton}>
              <BotaoSecundario label="Pular" onPress={() => navigation.navigate("CadastroViagemNavigator", { screen: "CadastroTurismo", params: { isCreatingViagem: true } })} />
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

