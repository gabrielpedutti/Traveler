import { CadastroRequestDto } from "../types/dto/CadastroRequestDto";
import travelerApi from "./api/travelerApi";

export async function cadastrarUsuario(payload: CadastroRequestDto): Promise<CadastroRequestDto>{
  const response = await travelerApi.post('/usuarios', payload);
  if(response.status === 201){
    console.log('201')
    console.log(response)
    return response.data;
  } else {
    console.log('erro')
    throw new Error('Erro ao cadastrar usuário: ', response.data.message);
  }
}