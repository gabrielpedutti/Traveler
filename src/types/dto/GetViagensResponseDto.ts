export type GetViagensResponseDto = {
  id: number;
  nome: string;
  viagem_destino_id: number;
  data_inicio: string;
  data_fim: string;
  usuario_id: number;
  status_viagem_id: number;
  created_at: string;
  updated_at: string;
  viagem_destino: {
    nm_municipio: string;
    nm_estado: string;
    nm_pais: string;
  };
  status_viagem: {
    descricao: string;
  };
}