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

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Obtem os componentes da data
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // UTCMonth retorna meses de 0 a 11
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export const formatarIntervaloDatas = (dataInicioString: string, dataFimString: string): string => {
  if (!dataInicioString || !dataFimString) {
    return 'Datas Indisponíveis';
  }

  const mesesAbreviados = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
  ];

  try {
    const dataInicio = new Date(dataInicioString);
    const dataFim = new Date(dataFimString);

    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
      return 'Datas Inválidas';
    }

    const diaInicio = dataInicio.getDate();
    const mesInicio = mesesAbreviados[dataInicio.getMonth()];
    const anoInicio = dataInicio.getFullYear();

    const diaFim = dataFim.getDate();
    const mesFim = mesesAbreviados[dataFim.getMonth()];
    const anoFim = dataFim.getFullYear();

    // Se as datas estão no mesmo mês e ano
    if (dataInicio.getMonth() === dataFim.getMonth() && dataInicio.getFullYear() === dataFim.getFullYear()) {
      // Ex: "24-29/JUN/2025"
      return `${diaInicio} - ${diaFim}/${mesInicio}/${anoInicio}`;
    } else if (dataInicio.getFullYear() === dataFim.getFullYear()) {
      // Se estão em meses diferentes, mas no mesmo ano
      // Ex: "24/JUN - 29/JUL/2025"
      return `${diaInicio}/${mesInicio} - ${diaFim}/${mesFim}/${anoInicio}`;
    } else {
      // Se estão em anos diferentes
      // Ex: "24/JUN/2025 - 29/JUL/2026"
      return `${diaInicio}/${mesInicio}/${anoInicio} - ${diaFim}/${mesFim}/${anoFim}`;
    }

  } catch (e) {
    console.error("Erro ao formatar intervalo de datas:", e);
    return 'Erro na Formatação';
  }
};