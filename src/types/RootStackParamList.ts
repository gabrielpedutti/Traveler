import { RouteProp } from "@react-navigation/native";
import { GetViagensResponseDto } from "./dto/GetViagensResponseDto";
import GetHospedagemResponseDto from "./dto/GetHospedagemPorViagemDto";
import GetTransporteResponseDto from "./dto/GetTransportePorViagemDto";
import GetPasseiosPorViagemDto from "./dto/GetPasseiosPorViagemDto";
import GetViagemResponseDto from "./dto/GetViagemResponseDto";

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
  EditarTransporte: { transporte: GetTransporteResponseDto, viagem: GetViagensResponseDto };
  EditarHospedagem: { hospedagem: GetHospedagemResponseDto, viagem: GetViagensResponseDto };
  EditarPasseio: { passeio: GetPasseiosPorViagemDto, viagem: GetViagensResponseDto };
  CadastroDespesa: { viagem: GetViagensResponseDto };
  CadastroViagem: undefined;
  BaseCadastroViagem: undefined;
  ResumoViagem: undefined;
  Viagens: undefined;
  ViagemSelecionada: { viagem: GetViagensResponseDto };
  // CadastroViagemNavigator: { screen: keyof CadastroViagemParamList; params?: any };
  DetalhesHospedagem: { hospedagem: GetHospedagemResponseDto, viagem: GetViagemResponseDto };
  DetalhesTransporte: { transporte: GetTransporteResponseDto, viagem: GetViagemResponseDto };
  DetalhesPasseio: { passeio: GetPasseiosPorViagemDto, viagem: GetViagemResponseDto };
};

export type CadastroTransporteRouteProp = RouteProp<RootStackParamList, 'CadastroTransporte'>;
export type CadastroHospedagemRouteProp = RouteProp<RootStackParamList, 'CadastroHospedagem'>;
export type CadastroTurismoRouteProp = RouteProp<RootStackParamList, 'CadastroTurismo'>;
export type CadastroDespesaRouteProp = RouteProp<RootStackParamList, 'CadastroDespesa'>;
export type EditarTransporteRouteProp = RouteProp<RootStackParamList, 'EditarTransporte'>;
export type EditarHospedagemRouteProp = RouteProp<RootStackParamList, 'EditarHospedagem'>;
export type EditarPasseioRouteProp = RouteProp<RootStackParamList, 'EditarPasseio'>;