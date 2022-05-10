import axios from 'axios';

import { BASE_URL } from '~~/models/constants/constants';

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

export default API;
