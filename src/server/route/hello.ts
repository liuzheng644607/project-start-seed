import { Context } from 'koa';
import { EventEmitter } from 'events';
import { PassThrough } from 'stream';
import { GET, ALL } from '@server/decorator/router';

export default class {
  @GET('/api/hello')
  hello(ctx: Context) {
    console.log(ctx);
    return {
      data: 0
    };
  }

  @ALL('/api/nowTime')
  nowTime(ctx: Context) {
    ctx.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const dispathcher = new EventEmitter();
    const stream = new PassThrough();
    let timer: NodeJS.Timeout | null = null;
    const fn = (data: Object, event: string) => {
      if (event) {
        stream.write(`event: ${event}\n`);
      }
      stream.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const finish = () => {
      console.log('finish');
      if (timer) {
        clearTimeout(timer);
      }
      dispathcher.removeListener('message', fn);
    };

    ctx.body = stream;

    stream.write(': open stream\n\n');

    dispathcher.on('message', fn);
    ctx.req
      .on('close', finish)
      .on('finish', finish)
      .on('error', finish);
    const autoSendData = () => {
      dispathcher.emit('message', new Date());
      timer = setTimeout(autoSendData, 1000);
    };

    autoSendData();
  }
}
