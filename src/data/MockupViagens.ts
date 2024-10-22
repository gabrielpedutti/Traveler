import { MockupViagens } from "../types/MockupViagens";

export const mockupViagens: MockupViagens[] = [
  {
    destino: "Rio de Janeiro",
    data: "25/03/2025",
    tipoTransporte: "Voo",
    numeroBilhete: "AA015",
    tipoHospedagem: "Hotel",
    nomeHospedagem: "Copacabana Palace",
    pagina: "ResumoViagem",
    imagem: require('../../assets/RioDeJaneiro.jpeg')
  },
  {
    destino: "Curitiba",
    data: "15/05/2025",
    tipoTransporte: "Voo",
    numeroBilhete: "AA016",
    tipoHospedagem: "Hotel",
    nomeHospedagem: "Andrade CWB Hotel",
    pagina: "ResumoViagem",
    imagem: require('../../assets/Curitiba.jpg')
  },
  {
    destino: "Fortaleza",
    data: "07/06/2025",
    tipoTransporte: "Voo",
    numeroBilhete: "AA017",
    tipoHospedagem: "Hotel",
    nomeHospedagem: "Fortaleza Palace",
    pagina: "ResumoViagem",
    imagem: require('../../assets/Fortaleza.jpg')
  },
  {
    destino: "Fernando de Noronha",
    data: "27/07/2025",
    tipoTransporte: "Voo",
    numeroBilhete: "AA018",
    tipoHospedagem: "Hotel",
    nomeHospedagem: "Noronha Palace",
    pagina: "ResumoViagem",
    imagem: require('../../assets/FernandoDeNoronha.jpg')
  },
  {
    destino: "Acre",
    data: "03/10/2025",
    tipoTransporte: "Voo",
    numeroBilhete: "AA019",
    tipoHospedagem: "Hotel",
    nomeHospedagem: "Acre Palace",
    pagina: "ResumoViagem",
    imagem: require('../../assets/Acre.jpg')
  }
];