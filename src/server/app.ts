import { Context } from 'koa';
import * as path from 'path';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as httpProxy from 'http-proxy';
import * as config from 'config';
import * as favicon from 'koa-favicon';
import * as koaStatic from 'koa-static';
import routes from '@server/route';

const app = new Koa();
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

if (isDev) {
  const httpProxyServer = httpProxy.createProxyServer();
  app.use((ctx: Context, next: Function) => {
    const shouldIgnore = config
    .get<[string]>('webpackDevServerProxyIgnore')
    .find((em: string) => ctx.path.startsWith(em));

    if (shouldIgnore) {
      return next();
    } else {
      ctx.respond = false;
      return httpProxyServer.web(ctx.req, ctx.res, {
        target: `http://127.0.0.1:${config.get('webpack.port')}`
      });
    }
  });
} else {
  // 非本地环境暴露 static 目录
  app.use(koaStatic(path.resolve(config.get('root'), './static')));

  // 非线上环境暴露 sourcemap 目录
  if (!isProd) {
    app.use(koaStatic(path.resolve(config.get('root'), './sourcemap')));
  }
}

app.use(bodyParser());
app.use(favicon(__dirname + '/favicon.ico'));
app.use(routes);

export default app;
