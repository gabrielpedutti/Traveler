interface TransporteDespesaDto {
  valor: number;
}

interface tipoTransporte {
  descricao: string;
}

interface transporteDestinoDto {
  nm_municipio: string;
  nm_estado: string;
  nm_pais: string;
}

interface GetTransporteResponseDto {
  id: number;
  nome: string;
  tipo_id: number;
  data: string;
  despesa_id: number;
  viagem_id: number;
  transporte_destino_id: number;
  documento_anexo: string | null;
  created_at: string; // Formato ISO 8601 string
  updated_at: string; // Formato ISO 8601 string
  usuario_id: number;
  despesa: TransporteDespesaDto;
  tipo_transporte: tipoTransporte;
  transporte_destino: transporteDestinoDto;
}

export default GetTransporteResponseDto;