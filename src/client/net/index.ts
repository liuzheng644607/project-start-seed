import axios from 'axios';
import { IGetRoutes } from '../../typings/net';

interface IGetRoute extends IGetRoutes {}

interface NetConfig {}

export function getApi<PATH extends keyof IGetRoute>(path: PATH, config?: NetConfig) {
  return async (params: IGetRoute[PATH]['request']) => {
    const { data } = await axios.get<IGetRoute[PATH]['response']>(path as string, {
      params,
      ...config,
    });
    return data;
  };
}
