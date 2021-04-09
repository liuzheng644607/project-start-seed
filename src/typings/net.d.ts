
import * as IResRoutes from './NetTypings/responses/routes';
import * as IReqRoutes from './NetTypings/requests/routes';


export type IGetRoutes = {
  [key in keyof IResRoutes.IGetRoutes]: {
    response: {code: number, data: IResRoutes.IGetRoutes[key], message: string},
    request: IReqRoutes.IGetRoutes[key],
  }
}

declare module '@net' {
  interface IGetRoute extends IGetRoutes {};
}
