export type CadastroRequestDto = {
  nome: string;
  data_nascimento: string;
  email: string;
  senha: string;
  municipio_id: number;
  tipo_usuario_id: number;
  tipo_cadastro_id: number;
};
