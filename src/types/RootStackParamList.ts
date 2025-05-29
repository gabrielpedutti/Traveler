import { RouteProp } from "@react-navigation/native";
import { GetViagensResponseDto } from "./dto/GetViagensResponseDto";
import GetHospedagemResponseDto from "./dto/GetHospedagemPorViagemDto";
import GetTransporteResponseDto from "./dto/GetTransportePorViagemDto";

// export type CadastroViagemParamList = {
//   CadastroHospedagem: undefined;
//   CadastroTransporte: undefined;
//   CadastroTurismo: undefined;
//   CadastroViagem: undefined;
// }

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  CadastroEndereco: undefined;
  MenuPerfil: undefined;
  MenuPrincipal: undefined;
  CadastroTransporte: { isCreatingViagem?: boolean, viagem: GetViagensResponseDto };
  CadastroHospedagem: { isCreatingViagem?: boolean, viagem: GetViagensResponseDto };
  CadastroTurismo: { isCreatingViagem?: boolean, viagem: GetViagensResponseDto };
  CadastroViagem: undefined;
  BaseCadastroViagem: undefined;
  ResumoViagem: undefined;
  Viagens: undefined;
  ViagemSelecionada: { viagem: GetViagensResponseDto };
  // CadastroViagemNavigator: { screen: keyof CadastroViagemParamList; params?: any };
  DetalhesHospedagem: { hospedagem: GetHospedagemResponseDto };
  DetalhesTransporte: { transporte: GetTransporteResponseDto };
  DetalhesTurismo: { passeio: GetViagensResponseDto };
};

export type CadastroTransporteRouteProp = RouteProp<RootStackParamList, 'CadastroTransporte'>;