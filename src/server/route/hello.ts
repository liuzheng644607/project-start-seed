import { Context } from 'koa';
import { PassThrough } from 'stream';
import { route, } from '@server/decorator/router';

@route('/api')
export default class {
  @route('/hello')
  hello() {
    return {
      data: 'hay!'
    };
  }

  @route('/nowTime')
  nowTime(ctx: Context) {
    ctx.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    const stream = new PassThrough();
    let timer: NodeJS.Timeout | null = null;
    const sendData = (data: Object, event?: string) => {
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
    };

    ctx.body = stream;

    stream.write(': open stream\n\n');
    ctx.req
      .on('close', finish)
      .on('finish', finish)
      .on('error', finish);
    const autoSendData = () => {
      sendData(new Date());
      timer = setTimeout(autoSendData, 1000);
    };

    autoSendData();
  }
}
