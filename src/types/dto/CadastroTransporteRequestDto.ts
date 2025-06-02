interface CadastroTransporteRequestDto {
  id?: number;
  nome: string;
  tipo_id: number;
  data: string;
  viagem_id: number;
  transporte_destino_id: number;
  documento_anexo?: string | null;
  valor: number;
}

export default CadastroTransporteRequestDto;