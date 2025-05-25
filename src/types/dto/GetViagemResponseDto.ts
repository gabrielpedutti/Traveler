interface Pais {
  nm_pais?: string;
}

interface Estado {
  nm_estado?: string;
  pais?: Pais;
}

interface Municipio {
  nm_municipio?: string;
  estado?: Estado;
}

interface StatusViagem {
  descricao?: string;
}

interface GetViagemResponseDto {
  id?: number;
  nome?: string;
  descricao?: string;
  viagem_origem_id?: number;
  viagem_destino_id?: number;
  data_inicio?: string;
  data_fim?: string;
  usuario_id?: number;
  status_viagem_id?: number;
  created_at?: string;
  updated_at?: string;
  viagem_origem?: Municipio;
  viagem_destino?: Municipio;
  status_viagem?: StatusViagem;
}

export default GetViagemResponseDto;