import axios from 'axios';

const travelerApi = axios.create({
  baseURL: 'http://192.168.68.102:3333/'
});

export default travelerApi;