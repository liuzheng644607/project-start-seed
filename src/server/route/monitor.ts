import { route } from '@server/decorator/router';

@route('/api/monitor')
export default class {
  @route('/alive')
  monitor() {
    return {
      data: true,
      message: '成功'
    };
  }
}
