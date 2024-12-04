interface CadastroDespesaResponseDto {
  id: number;
  descricao: string;
  valor: number;
  data: string; 
  usuario_id: number;
  viagem_id: number;
  tipo_despesa_id: number;
  created_at: string;
  updated_at: string;
}
