import { Context } from 'koa';
import getUid from '@src/server/utils/uid';
import * as URL from 'url';
interface UserInfo {
  nickName: string;
  avatar: string;
  userId: string;
}

const UserUid = 'user-uid';
const userKey = 'localUserInfo';

const SKIP_PATHS = [
  /\.(js|css|js\.map|css\.map)$/,
  /\.(png|jpg|jpeg|gif|ico)$/,
  /\/favicon\.ico/,
  /\/login/,
];

/**
 * 一个月
 */
const MAX_AGE = 1000 * 60 * 60 * 24 * 30;

export default (ctx: Context, next: Function) => {
  if (!SKIP_PATHS.some((r) => r.test(ctx.path))) {
    const userUid = ctx.cookies.get(UserUid);
    if (!userUid) {
      ctx.cookies.set(UserUid, getUid(), {
        maxAge: MAX_AGE
      });
    }
    const userInfoCookie = ctx.cookies.get(userKey);
    let userInfo: UserInfo | undefined;
    try {
      if (userInfoCookie) {
        userInfo = JSON.parse(decodeURIComponent(userInfoCookie));
      }
    } catch {}
    if (userInfo && userInfo.userId) {
      ctx.user = userInfo;
    } else {
      const p = URL.format({
        pathname: '/login',
        query: {
          redirect: encodeURIComponent(ctx.path),
        },
      });
      ctx.response.redirect(p);
      return;
    }
  }
  next();
};
