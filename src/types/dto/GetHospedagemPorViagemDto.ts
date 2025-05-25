interface HospedagemDespesaDto {
  valor: number;
}

interface tipoHospedagem {
  descricao: string;
}

interface GetHospedagemResponseDto {
  id: number;
  nome: string;
  tipo_id: number;
  data_checkin: string;
  data_checkout: string;
  despesa_id: number;
  viagem_id: number;
  endereco: string;
  documento_anexo: string | null;
  created_at: string; // Formato ISO 8601 string
  updated_at: string; // Formato ISO 8601 string
  usuario_id: number;
  despesa: HospedagemDespesaDto;
  tipo_hospedagem: tipoHospedagem;
}

export default GetHospedagemResponseDto;