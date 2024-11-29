export function formatToISOString(dateString: string): string {
  // Divide a string da data no formato dd/mm/aaaa
  const [day, month, year] = dateString.split("/").map(Number);

  // Cria um objeto Date com o fuso horário UTC
  const date = new Date(Date.UTC(year, month - 1, day));

  // Converte a data para o formato ISO
  return date.toISOString();
}

export function formatToISO(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}