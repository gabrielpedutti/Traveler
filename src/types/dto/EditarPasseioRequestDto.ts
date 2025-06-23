interface EditarPasseioRequestDto {
  id?: number;
  nome: string;
  tipo_id: number;
  data: string;
  viagem_id: number;
  documento_anexo?: string | null;
  valor: number;
  despesa_id: number;
}

export default EditarPasseioRequestDto;