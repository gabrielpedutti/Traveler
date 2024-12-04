export function formatarParaReal(valor: number | string): string {
  // Converte para número caso seja string
  const numero: number = typeof valor === 'string' ? parseFloat(valor) : valor;

  // Valida se o número é válido
  if (isNaN(numero)) {
    throw new Error('O valor fornecido não é um número válido');
  }

  // Retorna o valor formatado como moeda brasileira
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

