interface CadastroViagemRequestDto {
  nome: string;
  descricao: string;
  viagem_origem_id: number;
  viagem_destino_id: number;
  data_inicio: string;
  data_fim: string;
  usuario_id: number;
  status_viagem_id: number;
}