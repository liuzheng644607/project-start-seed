import * as React from 'react';
import { observer } from 'mobx-react';
// import * as net from '@net';
import CSSModules from '@utils/cssmodules';

import * as styles from './index.css';
interface IProps {}
interface IState {}

@observer
@CSSModules(styles)
export default class extends React.Component<IProps, IState> {

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    // const res = await net.getApi('/api/v1/user/info')({
    //   id: 1,
    // });
    // console.log(res.data);
  }

  render() {
    // const { userInfo } = ChatStore;
    return (
      <div styleName="avatar-gen-page">1</div>
    );
  }
}
