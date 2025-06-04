import CadastroHospedagemRequestDto from "../types/dto/CadastroHospedagemRequestDto";
import CadastroPasseioRequestDto from "../types/dto/CadastroPasseioRequestDto";
import { CadastroRequestDto } from "../types/dto/CadastroRequestDto";
import CadastroTransporteRequestDto from "../types/dto/CadastroTransporteRequestDto";
import CadastroViagemRequestDto from "../types/dto/CadastroViagemRequestDto";
import CadastroViagemResponseDto from "../types/dto/CadastroViagemResponseDto";
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

export async function cadastrarViagemBanco(payload: CadastroViagemRequestDto): Promise<CadastroViagemResponseDto | ErroResponseDto> {
  try {
    console.log(payload);
    // Enviando a requisição via axios
    const response = await travelerApi.post('/viagem', payload);

    // Se a resposta for 201 (Criado), retorna os dados da viagem
    if (response.status === 201) {
      return response.data;  // Dados da viagem criada
    }

    // Se o status não for 201, retorna um erro customizado com a estrutura de erro
    return {
      status: 'error',  // Ou qualquer valor apropriado
      statusCode: response.status,
      message: response.data?.message || 'Erro desconhecido ao cadastrar viagem',
    } as ErroResponseDto;

  } catch (error: any) {
    // Captura de erro se ocorrer um erro na requisição
    const errorMessage = error.response?.data?.message || 'Erro inesperado ao cadastrar viagem';
    
    return {
      status: 'error',  // Definindo status como erro
      statusCode: error.response?.status || 500,  // Retorna o status do erro ou 500 se não estiver presente
      message: errorMessage,
    } as ErroResponseDto;  // Retorna a estrutura de erro com a mensagem capturada
  }
}

export async function cadastrarDespesaBanco(payload: CadastroDespesaRequestDto): Promise<CadastroDespesaResponseDto | ErroResponseDto> {
  try {
    console.log(payload);
    // Enviando a requisição via axios
    const response = await travelerApi.post('/despesa', payload);

    // Se a resposta for 201 (Criado), retorna os dados da despesa
    if (response.status === 201) {
      return response.data;  // Dados da despesa criada
    }

    // Se o status não for 201, retorna um erro customizado com a estrutura de erro
    return {
      status: 'error',  // Ou qualquer valor apropriado
      statusCode: response.status,
      message: response.data?.message || 'Erro desconhecido ao cadastrar despesa',
    } as ErroResponseDto;

  } catch (error: any) {
    // Captura de erro se ocorrer um erro na requisição
    const errorMessage = error.response?.data?.message || 'Erro inesperado ao cadastrar despesa';
    
    return {
      status: 'error',  // Definindo status como erro
      statusCode: error.response?.status || 500,  // Retorna o status do erro ou 500 se não estiver presente
      message: errorMessage,
    } as ErroResponseDto;  // Retorna a estrutura de erro com a mensagem capturada
  }
}

export async function cadastrarTransporteBanco(payload: CadastroTransporteRequestDto): Promise<CadastroTransporteRequestDto | ErroResponseDto> {
  try {
    console.log(payload);
    // Enviando a requisição via axios
    const response = await travelerApi.post('/transporte', payload);

    // Se a resposta for 201 (Criado), retorna os dados da despesa
    if (response.status === 201) {
      return response.data;  // Dados da despesa criada
    }

    // Se o status não for 201, retorna um erro customizado com a estrutura de erro
    return {
      status: 'error',  // Ou qualquer valor apropriado
      statusCode: response.status,
      message: response.data?.message || 'Erro desconhecido ao cadastrar despesa',
    } as ErroResponseDto;

  } catch (error: any) {
    // Captura de erro se ocorrer um erro na requisição
    const errorMessage = error.response?.data?.message || 'Erro inesperado ao cadastrar despesa';
    
    return {
      status: 'error',  // Definindo status como erro
      statusCode: error.response?.status || 500,  // Retorna o status do erro ou 500 se não estiver presente
      message: errorMessage,
    } as ErroResponseDto;  // Retorna a estrutura de erro com a mensagem capturada
  }
}

export async function cadastrarHospedagemBanco(payload: CadastroHospedagemRequestDto): Promise<CadastroHospedagemRequestDto | ErroResponseDto> {
  try {
    console.log(payload);
    // Enviando a requisição via axios
    const response = await travelerApi.post('/hospedagem', payload);
    // Se a resposta for 201 (Criado), retorna os dados da despesa
    if (response.status === 201) {
      return response.data;  // Dados da despesa criada
    }
    // Se o status não for 201, retorna um erro customizado com a estrutura de erro
    return {
      status: 'error',  // Ou qualquer valor apropriado
      statusCode: response.status,
      message: response.data?.message || 'Erro desconhecido ao cadastrar despesa',
    } as ErroResponseDto;
  } catch (error: any) {
    // Captura de erro se ocorrer um erro na requisição
    const errorMessage = error.response?.data?.message || 'Erro inesperado ao cadastrar despesa';
    
    return {
      status: 'error',  // Definindo status como erro
      statusCode: error.response?.status || 500,  // Retorna o status do erro ou 500 se não estiver presente
      message: errorMessage,
    } as ErroResponseDto;  // Retorna a estrutura de erro com a mensagem capturada
  }
}

export async function cadastrarPasseioBanco(payload: CadastroPasseioRequestDto): Promise<any | ErroResponseDto> {
  try {
    console.log(payload);
    // Enviando a requisição via axios
    const response = await travelerApi.post('/passeio', payload);
    // Se a resposta for 201 (Criado), retorna os dados do passeio
    if (response.status === 201) {
      return response.data;  // Dados do passeio criado
    }
    // Se o status não for 201, retorna um erro customizado com a estrutura de erro
    return {
      status: 'error',  // Ou qualquer valor apropriado
      statusCode: response.status,
      message: response.data?.message || 'Erro desconhecido ao cadastrar passeio',
    } as ErroResponseDto;
  } catch (error: any) {
    // Captura de erro se ocorrer um erro na requisição
    const errorMessage = error.response?.data?.message || 'Erro inesperado ao cadastrar passeio';
    return {
      status: 'error',  // Definindo status como erro
      statusCode: error.response?.status || 500,  // Retorna o status do erro ou 500 se não estiver presente
      message: errorMessage,
    } as ErroResponseDto;  // Retorna a estrutura de erro com a mensagem capturada
  }
}
