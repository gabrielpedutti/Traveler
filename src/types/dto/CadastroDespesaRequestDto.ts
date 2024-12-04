interface CadastroDespesaRequestDto {
  descricao: string;
  valor: number;
  data: string;
  usuario_id: number;
  viagem_id: number;
  tipo_despesa_id: number;
}