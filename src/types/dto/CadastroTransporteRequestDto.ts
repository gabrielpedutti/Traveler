interface CadastroTransporteRequestDto {
  nome: string;
  tipo_id: number;
  data: string;
  valor: number;
  viagem_id: number;
  transporte_destino_id: number;
  usuario_id: number;
}

export default CadastroTransporteRequestDto;