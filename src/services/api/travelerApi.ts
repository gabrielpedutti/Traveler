import axios from 'axios';

const travelerApi = axios.create({
  baseURL: 'http://192.168.15.4:3333/'
});

export default travelerApi;