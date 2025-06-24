interface EditarViagemRequestDto {
  id: number,
  nome: string,
  viagem_destino_id: number,
  data_inicio: string,
  data_fim: string,
  usuario_id: number,
  status_viagem_id: number,
}

export default EditarViagemRequestDto;