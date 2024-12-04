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

const cadastroTrasnporteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipoTransporte: z.string().min(1, "Tipo de transporte é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  data: z.string().min(1, "Data é obrigatório"),
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

type CadastroTransporteSchema = z.infer<typeof cadastroTrasnporteSchema>;

function CadastroTransporte() {

  const { control, handleSubmit, formState: { errors } } = useForm<CadastroTransporteSchema>({
    resolver: zodResolver(cadastroTrasnporteSchema),
    defaultValues: {
      nome: "",
      tipoTransporte: "",
      valor: "",
      data: "",
      viagem_origem: 0,
      viagem_destino: 0,
    }
  });

  function onFormValidationError(errors: any) {
    console.log(errors);
  }

  async function cadastrarTransporte(data: CadastroTransporteSchema) {
    console.log(data);
  }

  return(
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
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
                  <Picker.Item label="Selecione o tipo de transporte" value="" />
                  {/* {cidades.map((item) => (
                    <Picker.Item key={item.id} value={item.id} label={item.nm_municipio} />
                  ))} */}
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
          <Text style={styles.titulo}>Selecione a Origem</Text>
          <SelecionarPaisEstadoCidade municipioName={"viagem_origem"} control={control} errors={errors} />
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

