import axios from 'axios';

const ibgeApi = axios.create({
  baseURL: 'https://viacep.com.br/ws/'
});

export default ibgeApi;