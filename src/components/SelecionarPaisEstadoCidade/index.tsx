import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Controller, FieldError, Control, FieldErrors } from "react-hook-form";
import { EstadoResponseDto } from "../../types/dto/EstadoResponseDto";
import { MunicipioResponseDto } from "../../types/dto/MunicipioResponseDto";
import { PaisResponseDto } from "../../types/dto/PaisResponseDto";

import { styles } from "./styles";
import travelerApi from "../../services/api/travelerApi";
import { Dropdown } from "react-native-element-dropdown";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

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
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={paises}
            search
            maxHeight={300}
            labelField="nm_pais" // Propriedade no objeto do país para exibir
            valueField="id"     // Propriedade no objeto do país para usar como valor
            placeholder="Selecione o país"
            searchPlaceholder="Buscar..."
            value={paisEscolhido}
            keyboardAvoiding={false}
            onChange={item => {
              setPaisEscolhido(item.id);
              limparEstados();
            }}
             renderLeftIcon={() => (
            <FontAwesome6Icon style={styles.icon} color="#2c88d9" name="globe" size={16} />
            )}
          />
        </View>
      </View>

      <View style={styles.wrapper}>
        <Text style={styles.label}>Selecione o estado</Text>
        <View style={styles.containerInput}>
           <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={estados} // Usar a lista de estados
            search
            maxHeight={300}
            labelField="nm_estado" // Propriedade no objeto do estado
            valueField="id"     // Propriedade no objeto do estado para usar como valor
            placeholder="Selecione o estado"
            searchPlaceholder="Buscar..."
            value={estadoEscolhido}
            keyboardAvoiding={false}
            dropdownPosition="top"
            onChange={item => {
              setEstadoEscolhido(item.id);
            }}
            disable={estados.length === 0} // Desabilitar se não houver estados
             renderLeftIcon={() => (
            <FontAwesome6Icon style={styles.icon} color="#2c88d9" name="map" size={16} />
            )}
          />
        </View>
      </View>

      <View style={styles.wrapper}>
        <Text style={styles.label}>Selecione a cidade</Text>
        <View style={styles.containerInput}>
          <Controller
            name={municipioName}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={cidades} // Usar a lista de cidades
                search
                maxHeight={300}
                labelField="nm_municipio" // Propriedade no objeto do município
                valueField="id"     // Propriedade no objeto do município para usar como valor
                placeholder="Selecione a cidade"
                searchPlaceholder="Buscar..."
                value={value} // O valor agora vem do react-hook-form
                keyboardAvoiding={false}
                onChange={item => {
                  onChange(item.id); // Atualizar o valor no react-hook-form
                }}
                disable={cidades.length === 0} // Desabilitar se não houver cidades
                renderLeftIcon={() => (
                <FontAwesome6Icon style={styles.icon} color="#2c88d9" name="city" size={16} />
                )}
              />
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
