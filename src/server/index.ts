import 'module-alias/register';
import * as config from 'config';
import app from './app';
import { ChatRoom, PlayerRoom } from './room';

const port = config.get('port');

const server = app.listen(port, () => {
  console.info('Server端启动成功监听在端口：', port);
});

// tslint:disable-next-line:no-unused-expression
new ChatRoom(server);
// tslint:disable-next-line:no-unused-expression
new PlayerRoom(server);
