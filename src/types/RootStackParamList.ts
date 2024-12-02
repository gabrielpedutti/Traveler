import { GetViagensResponseDto } from "./dto/GetViagensResponseDto";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  CadastroEndereco: undefined;
  MenuPerfil: undefined;
  MenuPrincipal: undefined;
  CadastroHospedagem: undefined;
  CadastroTransporte: undefined;
  CadastroTurismo: undefined;
  CadastroViagem: undefined;
  BaseCadastroViagem: undefined;
  ResumoViagem: undefined;
  Viagens: undefined;
  ViagemSelecionada: { item: GetViagensResponseDto };
}