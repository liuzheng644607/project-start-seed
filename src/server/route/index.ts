import * as Router from 'koa-router';
import { setRouter } from '@server/decorator/router';
import './hello';
import './monitor';

const router = new Router();
setRouter(router);
export default router.routes();
