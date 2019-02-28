import axios from 'axios';

export function get(url: string) {
  return axios.get(url);
}
