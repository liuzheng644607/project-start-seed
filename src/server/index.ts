import 'module-alias/register';
import * as config from 'config';
import app from './app';

const port = config.get('port');

app.listen(port, () => {
  console.info('Server端启动成功监听在端口：', port);
});
