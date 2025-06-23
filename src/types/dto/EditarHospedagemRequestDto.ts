interface EditarHospedagemRequestDto {
  id?: number;
  nome: string;
  tipo_id: number;
  data_checkin: string;
  data_checkout: string;
  viagem_id: number;
  endereco: string;
  documento_anexo?: string | null;
  valor: number;
  despesa_id: number;
  usuario_id: number;
}

export default EditarHospedagemRequestDto;