interface CadastroHospedagemRequestDto {
  nome: string;
  tipo_id: number;
  data_checkin: string;
  data_checkout: string;
  valor: number;
  viagem_id: number;
  endereco: string;
  documento_anexo: string;
}

export default CadastroHospedagemRequestDto;