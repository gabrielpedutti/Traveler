import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Controller, FieldError, Control, FieldErrors } from "react-hook-form";
import { EstadoResponseDto } from "../../types/dto/EstadoResponseDto";
import { MunicipioResponseDto } from "../../types/dto/MunicipioResponseDto";
import { PaisResponseDto } from "../../types/dto/PaisResponseDto";

import { styles } from "./styles";
import travelerApi from "../../services/api/travelerApi";

interface SelecionarPaisEstadoCidadeProps {
  control: Control<any>; // Especifique os tipos esperados pelo react-hook-form
  errors: FieldErrors;
  municipioName: string;
}

function SelecionarPaisEstadoCidade({
  control,
  errors,
  municipioName,
}: SelecionarPaisEstadoCidadeProps) {
  const [paisEscolhido, setPaisEscolhido] = useState<string>("");
  const [paises, setPaises] = useState<PaisResponseDto[]>([]);
  const [estadoEscolhido, setEstadoEscolhido] = useState<string>("");
  const [estados, setEstados] = useState<EstadoResponseDto[]>([]);
  const [cidades, setCidades] = useState<MunicipioResponseDto[]>([]);

  function limparEstados() {
    setEstados([]);
    setEstadoEscolhido("");
  }

  function limparCidades() {
    setCidades([]);
  }

  useEffect(() => {
    const consultaPaises = async () => {
      const response = await travelerApi.get("/locations/paises");
      setPaises(response.data);
    };
    consultaPaises();
  }, []);

  useEffect(() => {
    if (!paisEscolhido) {
      limparEstados();
      limparCidades();
      return;
    }

    const consultaEstados = async () => {
      const response = await travelerApi.get(
        `/locations/estados?idPais=${paisEscolhido}`
      );
      setEstados(response.data);
    };
    consultaEstados();
  }, [paisEscolhido]);

  useEffect(() => {
    if (!estadoEscolhido) {
      limparCidades();
      return;
    }

    const consultaCidades = async () => {
      const response = await travelerApi.get(
        `/locations/municipios?idEstado=${estadoEscolhido}`
      );
      setCidades(response.data);
    };
    consultaCidades();
  }, [estadoEscolhido]);

  return (
    <>
      <View style={styles.wrapper}>
        <Text style={styles.label}>Selecione o país</Text>
        <View style={styles.containerInput}>
          <Picker
            selectedValue={paisEscolhido}
            onValueChange={(itemValue) => {
              setPaisEscolhido(itemValue);
              limparEstados();
              limparCidades();
            }}
          >
            <Picker.Item label="Selecione o país" value="" />
            {paises.map((item) => (
              <Picker.Item key={item.id} value={item.id} label={item.nm_pais} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.wrapper}>
        <Text style={styles.label}>Selecione o estado</Text>
        <View style={styles.containerInput}>
          <Picker
            selectedValue={estadoEscolhido}
            onValueChange={(itemValue) => {
              setEstadoEscolhido(itemValue);
              limparCidades();
            }}
          >
            <Picker.Item label="Selecione o estado" value="" />
            {estados.map((item) => (
              <Picker.Item key={item.id} value={item.id} label={item.nm_estado} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.wrapper}>
        <Text style={styles.label}>Selecione a cidade</Text>
        <View style={styles.containerInput}>
          <Controller
            name={municipioName}
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
              >
                <Picker.Item label="Selecione a cidade" value="" />
                {cidades.map((item) => (
                  <Picker.Item key={item.id} value={item.id} label={item.nm_municipio} />
                ))}
              </Picker>
            )}
          />
        </View>
        {typeof errors[municipioName]?.message === 'string' && (
          <Text style={styles.error}>
            {errors[municipioName]?.message}
          </Text>
        )}
      </View>
    </>
  );
}

export default SelecionarPaisEstadoCidade;
