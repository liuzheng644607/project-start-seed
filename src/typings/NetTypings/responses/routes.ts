interface User {
  name: string;
  age: number;
}

export interface IGetRoutes {
  '/api/v1/user/info': User;
}
