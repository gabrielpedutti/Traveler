interface EstadoResponse {
  nm_estado: string;
  pais: {
    nm_pais: string;
    id: number;
  };
}

interface LocationsIdResponseDto {
  id: number;
  nm_municipio: string;
  nm_municipio_ascii: string;
  latitude: number;
  longitude: number;
  estado_id: number;
  estado: EstadoResponse;
}

export type { LocationsIdResponseDto };