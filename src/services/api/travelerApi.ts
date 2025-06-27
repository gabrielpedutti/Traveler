import axios from 'axios';

const travelerApi = axios.create({
  // baseURL: 'http://192.168.15.3:3333/'
  baseURL: 'http://44.220.11.148:3333/'
});

export default travelerApi;