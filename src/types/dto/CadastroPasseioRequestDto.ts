interface CadastroPasseioRequestDto {
  nome: string;
  tipo_id: number;
  data: string; // Formato ISO string (ex: '2023-10-27T10:00:00Z')
  valor: number;
  viagem_id: number;
  documento_anexo?: string | null;
}

export default CadastroPasseioRequestDto;