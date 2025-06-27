interface EditarDespesaRequestDto {
  id: number,
  descricao: string,
  tipo_id: number,
  viagem_id: number,
  data: string,
  usuario_id: number,
  valor: number,
}

export default EditarDespesaRequestDto;