import { RouteProp } from "@react-navigation/native";
import { GetViagensResponseDto } from "./dto/GetViagensResponseDto";
import GetHospedagemResponseDto from "./dto/GetHospedagemPorViagemDto";

export type CadastroViagemParamList = {
  CadastroHospedagem: undefined;
  CadastroTransporte: undefined;
  CadastroTurismo: undefined;
  CadastroViagem: undefined;
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  CadastroEndereco: undefined;
  MenuPerfil: undefined;
  MenuPrincipal: undefined;
  CadastroTransporte: { isCreatingViagem?: boolean };
  CadastroHospedagem: { isCreatingViagem?: boolean };
  CadastroTurismo: { isCreatingViagem?: boolean };
  CadastroViagem: undefined;
  BaseCadastroViagem: undefined;
  ResumoViagem: undefined;
  Viagens: undefined;
  ViagemSelecionada: { item: GetViagensResponseDto };
  CadastroViagemNavigator: { screen: keyof CadastroViagemParamList; params?: any };
  DetalhesHospedagem: { hospedagem: GetHospedagemResponseDto };
  DetalhesTransporte: { viagem: GetViagensResponseDto };
  DetalhesTurismo: { viagem: GetViagensResponseDto };
};

export type CadastroTransporteRouteProp = RouteProp<RootStackParamList, 'CadastroTransporte'>;