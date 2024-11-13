import { CadastroRequestDto } from "../types/dto/CadastroRequestDto";
import { ErroResponseDto } from "../types/dto/ErroResponseDto";
import travelerApi from "./api/travelerApi";

export async function cadastrarUsuario(payload: CadastroRequestDto): Promise<CadastroRequestDto | ErroResponseDto> {
  try {
    console.log(payload);
    // Enviando a requisição via axios
    const response = await travelerApi.post('/usuarios', payload);

    // Se a resposta for 201 (Criado), retorna os dados do usuário
    if (response.status === 201) {
      return response.data;  // Dados do usuário criado
    }

    // Se o status não for 201, retorna um erro customizado com a estrutura de erro
    return {
      status: 'error',  // Ou qualquer valor apropriado
      statusCode: response.status,
      message: response.data?.message || 'Erro desconhecido ao cadastrar usuário',
    } as ErroResponseDto;
  } catch (error: any) {
    // Captura de erro se ocorrer um erro na requisição
    const errorMessage = error.response?.data?.message || 'Erro inesperado ao cadastrar usuário';
    
    return {
      status: 'error',  // Definindo status como erro
      statusCode: error.response?.status || 500,  // Retorna o status do erro ou 500 se não estiver presente
      message: errorMessage,
    } as ErroResponseDto;  // Retorna a estrutura de erro com a mensagem capturada
  }
}
