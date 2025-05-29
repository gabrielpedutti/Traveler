interface tipoPasseioDto {
  descricao: string;
}

interface passeioDespesaDto {
  valor: number;
}

interface GetPasseiosPorViagemDto {
  id: number;
  nome: string;
  tipo_id: number;
  data: string;
  despesa_id: number;
  viagem_id: number;
  documento_anexo: string;
  usuario_id: number;
  created_at: string;
  updated_at: string;
  tipo_passeio: tipoPasseioDto;
  despesa: passeioDespesaDto;
}

export default GetPasseiosPorViagemDto;