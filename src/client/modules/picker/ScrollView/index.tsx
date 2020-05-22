import { CSSProperties, ReactNode } from 'react';
import { PureComponent } from 'react';
import * as React from 'react';
import * as classNames from 'classnames';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';
import { IScroll, IScrollOptions } from './vendor/iscroll';

export interface IBaseComponent {
  /**
   * 子元素
   */
  children?: ReactNode;
  /**
   * 附加额外的 class
   */
  className?: string;
  /**
   * id 选择器
   */
  id?: string;
  /**
   * 附加额外的样式
   */
  style?: CSSProperties;
}

export interface IScrollViewProps extends IBaseComponent {
  /**
   * iscroll 配置
   */
  scrollOption?: IScrollOptions;
  /**
   * 滚动事件
   */
  onScroll?: (s: IScroll) => void;
  /**
   * 滚动结束事件
   */
  onScrollStart?: (s: IScroll) => void;
  /**
   * 滚动结束事件
   */
  onScrollEnd?: (s: IScroll) => void;
  /**
   * 获取IScroll Instance
   */
  refIScroll?: (s: IScroll) => void;
}

const EVENTS: { [key: string]: string } = {
  scroll: 'onScroll',
  scrollStart: 'onScrollStart',
  scrollEnd: 'onScrollEnd',
};

const globalEventsHandleMap: { [key: string]: () => void } = {};

/**
 * **可滚动组件**-基于iscroll封装。
 */
@CSSModules(styles)
export class ScrollView extends PureComponent<IScrollViewProps> {
  private refScrollView?: HTMLElement;
  private scrollInstance?: IScroll;
  public static on = (key: string, handle: () => void) => {
    globalEventsHandleMap[key] = handle;
  };

  getScrollInstance(): IScroll | undefined {
    return this.scrollInstance;
  }

  componentDidMount() {
    const { scrollOption, refIScroll } = this.props;
    if (this.refScrollView) {
      this.scrollInstance = new IScroll(
        this.refScrollView,
        Object.assign(
          {
            // 移动端 h5 页面滑动  想永远不出现滚动条。感知上 像 native 靠近。
            // scrollbars: false, // 默认 false
            // 解决android下iscroll里的东西无法点击
            // 只在Android下开启，如果在iOS下开启会导致iOS下需要点击两次
            click: /Android/i.test(
              navigator.userAgent
            ) /*https://github.com/cubiq/iscroll/issues/783*/,
            probeType: 3,
          },
          scrollOption
        )
      );
      if (typeof refIScroll === 'function') {
        refIScroll(this.scrollInstance);
      }
      Object.keys(EVENTS).forEach((key) => {
        // tslint:disable-next-line:no-any
        const f = (this.props as any)[EVENTS[key]];
        if (typeof f === 'function') {
          (this.scrollInstance as IScroll).on(key, () => {
            if (this.scrollInstance) {
              f(this.scrollInstance);
            }
          });
          if (globalEventsHandleMap.hasOwnProperty(key)) {
            (this.scrollInstance as IScroll).on(
              key,
              globalEventsHandleMap[key]
            );
          }
        }
      });
    }
  }

  componentWillUnmount() {
    Object.keys(EVENTS).forEach((eventName: string) => {
      if (this.scrollInstance) {
        this.scrollInstance.off(eventName);
      }
    });
    if (this.scrollInstance) {
      this.scrollInstance.destroy();
      this.scrollInstance = undefined;
    }
  }

  render() {
    const { className, style, children } = this.props;
    if (!children) return null;
    // 如果children的数量大于1就用div包裹一层，因为iscroll要求子元素只能有一个
    let shouldWrap = false;
    if (Array.isArray(children)) {
      shouldWrap = children.filter((em) => !!em).length > 1;
    }
    return (
      <div
        className={classNames(className, styles.mcScrollView)}
        style={style}
        ref={(c) => (this.refScrollView = c as HTMLElement)}
      >
        {shouldWrap ? (
          <div styleName="scroll-container">{children}</div>
        ) : (
          children
        )}
      </div>
    );
  }
}

export default ScrollView;
export { IScroll, IScrollOptions } from './vendor/iscroll';
