import { Context } from 'koa';
import getUid from '@src/server/utils/uid';

const UserUid = 'user-uid';
/**
 * 一个月
 */
const MAX_AGE = 1000 * 60 * 60 * 24 * 30;

export default (ctx: Context, next: Function) => {
  const userUid = ctx.cookies.get(UserUid);
  if (!userUid) {
    ctx.cookies.set(UserUid, getUid(), {
      maxAge: MAX_AGE
    });
  }
  next();
};
