import * as Router from 'koa-router';
import { setRouter } from '@server/decorator/router';
import './hello';

const router = new Router();
setRouter(router);
export default router.routes();
