import * as Koa from 'koa';
import getFiles from '@server/utils/getFiles';

export default function(app: Koa) {
  Object.defineProperty(app.context, 'service', {
    get() {
      const ctx = this;
      getFiles(__dirname).forEach((fileName) => {
        if (fileName.includes('index.') || !fileName.endsWith('.js')) {
          return;
        }
        const Class = require(fileName).default;
        const pathArr = fileName.replace(__dirname, '').split('/');
        pathArr.shift();
        const fName = pathArr.pop()!.replace(/\.js$/, '');
        // tslint:disable-next-line:no-any
        let obj = {[fName]: new Class(ctx)};
        let i = pathArr.length;
        while (i--) {
          const name = pathArr[i];
          obj = {
            [name]: obj
          };
        }

        Object.assign(this, obj);
      });
      return this;
    }
  });
}
