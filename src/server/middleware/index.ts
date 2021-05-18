import Application from 'koa';
import User from './user';

export default (app: Application) => {
  app.use(User);
};
