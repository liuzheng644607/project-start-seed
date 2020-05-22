import { Component } from 'react';
import * as React from 'react';
import * as classNames from 'classnames';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';
import ScrollView, { IScroll, IBaseComponent } from './ScrollView';
const itemCount = 5;

export interface IBasePickerProps extends IBaseComponent {
  /**
   * 数据列表，一个二维数组, [[ { name: '北京‘, value: 'beijing', xxx: 'x' } ]]
   * Item必须要有name属性
   */
  data: IBasePickerListItem[][];

  /**
   * 列标题
   */
  columnTitle?: Array<JSX.Element | number | string>;

  /**
   * 默认选中的项的索引, 比如 [2] 表示选中第0组数据的 index为 2 的那一项
   */
  defaultSelected?: number[];

  /**
   * 高亮区域的内容
   */
  highlightChildren?: React.ReactNode;

  /**
   * 选中值变化的时候的回调
   * 参数是当前选中的项目数组
   */
  onChange?: (values: IBasePickerListItem[], idx: number | null) => void;
}

export interface IBasePickerState {}

export interface IBasePickerListItem {
  label: React.ReactNode;
  value: string;
  children?: IBasePickerListItem[];

  // tslint:disable-next-line:no-any
  [key: string]: any;
}

const SCROLL_TIME = 200;


@CSSModules(styles)
export class BasePicker extends Component<IBasePickerProps, IBasePickerState> {
  static defaultProps = {
    defaultSelected: [],
  };

  private itemHeight: number = 45;
  private refTopItem: HTMLDivElement | null = null;
  private refScrollViewList: ScrollView[] = [];
  private selectedItems: IBasePickerListItem[] = [];
  private rafTimer: number = 0;
  private refListEl: Array<HTMLUListElement | null> = [];
  private autoScrolling: boolean = false;
  private scrollTimer?: number;

  /**
   * view 滚动完成的时候，计算出合理的选中位置。
   */
  // tslint:disable-next-line:no-any
  private onViewScrollEnd = (scrollInstance: IScroll, idx: number) => {
    const { data, onChange } = this.props;
    const { itemHeight } = this;
    let y = scrollInstance.y - itemHeight / 2;
    const diff = y % itemHeight;
    y -= diff;
    if (!scrollInstance) {
      return;
    }
    const t = (Math.abs(diff) / itemHeight) * SCROLL_TIME;
    const selectedItemIndex = Math.floor(Math.abs(y) / itemHeight);
    const selectedList = data[idx];
    const selectedItem = selectedList[selectedItemIndex];
    const currentSelected: IBasePickerListItem[] = [];
    currentSelected[idx] = selectedItem;
    const changed: boolean = currentSelected[idx] !== this.selectedItems[idx];
    if (!this.autoScrolling) {
      this.autoScrolling = true;
      scrollInstance.scrollTo(0, y, t);
      scrollInstance.refresh();
    }
    if (!changed) {
      return;
    }
    this.selectedItems[idx] = selectedItem;
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      if (typeof onChange === 'function' && this.selectedItems.length) {
        onChange(this.selectedItems, idx);
      }
      this.autoScrolling = false;
    }, t);
  };

  /**
   * 给选中的item 新增一个 css class
   */
  // tslint:disable-next-line:no-any
  private _setItemActive(scrollInstance: IScroll, selectedItemIndex: number) {
    // tslint:disable-next-line:no-console
    console.log(scrollInstance, selectedItemIndex);
    // const allItems = scrollInstance.wrapper.querySelectorAll('li.item');
    // const className = 'active';
    // const allItemsArr = Array.prototype.slice.call(allItems);
    // allItemsArr.forEach((item: HTMLElement) => {
    //   if (item.dataset && Number(item.dataset.index) === selectedItemIndex) {
    //     // item.classList.add(className);
    //   } else {
    //     if (item.classList.contains(className)) {
    //       // item.classList.remove(className);
    //     }
    //   }
    // });
  }

  /**
   * 设置默认滚动位置
   */
  private setDefaultSelected(props: IBasePickerProps) {
    const { data, onChange } = props;
    const itemHeight = this.itemHeight;
    const defaultSelected = props.defaultSelected as number[];
    const defaultSelectedLength: number = defaultSelected.length;
    const dataLength: number = data.length;
    const diffLength: number = dataLength - defaultSelectedLength;
    const currentSelected: IBasePickerListItem[] = [];
    /**
     * 修正传入的默认选中的列表index 与 实际data 个数不相等问题
     */
    if (diffLength > 0) {
      Array(diffLength)
        .fill(0)
        .forEach((item) => {
          defaultSelected.push(item);
        });
    } else {
      defaultSelected.splice(dataLength);
    }

    /**
     * 根据默认值，然后滚动到指定位置
     */
    defaultSelected.forEach((itemIndex, dataIndex) => {
      // 拿到对应的 iscroll 实例
      const refScrollView = this.refScrollViewList[dataIndex];
      const refList = this.refListEl[dataIndex];
      if (refScrollView === undefined) {
        return;
      }
      const scrollInstance = refScrollView.getScrollInstance();
      if (!scrollInstance) {
        return;
      }
      if (!refList) {
        return;
      }
      const list = data[dataIndex];
      const maxIndex = list.length - 1;
      // index 范围
      itemIndex =
        itemIndex > maxIndex ? maxIndex : itemIndex < 0 ? 0 : itemIndex;
      const scrollY = -itemIndex * itemHeight;
      // 滚动到默认选择的位置
      scrollInstance.scrollTo(0, scrollY);
      scrollInstance.refresh();
      refList.style.transform = `translateY(${scrollY}px)`;
      this._setItemActive(scrollInstance, itemIndex);
      // 设置初始选中的值
      currentSelected[dataIndex] = list[itemIndex];
    });

    const changed: boolean = currentSelected.every((item, i) => {
      return this.selectedItems[i] === item;
    });

    this.selectedItems = currentSelected;

    if (!changed) {
      return;
    }

    if (typeof onChange === 'function' && this.selectedItems.length) {
      onChange(this.selectedItems, null);
    }
  }

  getItemHeight() {
    const { refTopItem } = this;
    if (refTopItem) {
      const height = getComputedStyle(refTopItem).height;
      if (height) {
        this.itemHeight = parseFloat(height);
      }
    }
  }

  componentDidMount() {
    const { onChange } = this.props;
    this.getItemHeight();
    this.setDefaultSelected(this.props);

    if (typeof onChange === 'function' && this.selectedItems.length) {
      onChange(this.selectedItems, null);
    }
  }

  componentWillReceiveProps(nextProps: IBasePickerProps) {
    /**
     * 使用了Modal的显示隐藏，所以这里延迟一下设置选中。
     */
    cancelAnimationFrame(this.rafTimer);
    this.rafTimer = requestAnimationFrame(() => {
      this.getItemHeight();
      this.setDefaultSelected(nextProps);
    });
  }

  /**
   * 生成 滚动列表
   */
  makeScrollViews() {
    const { data } = this.props;
    const extraLiCount = (itemCount - 1) / 2;
    const extraLi = Array(extraLiCount).fill(<li styleName="item" data-index={-1} />);
    return data.map((list, i) => {
      return (
        <div styleName="scroll-wrap" key={i}>
          <ScrollView
            key={i}
            className={styles.scrollContainer}
            // onScrollEnd={(c) => this.onViewScrollEnd(c, i)}
            scrollOption={
              {
                // bounce: false,
                snap: true,
                mouseWheel: true,
                snapStepY: this.itemHeight,
              }
            }
            ref={(c) => (this.refScrollViewList[i] = c as ScrollView)}
            onScroll={(s) => {
              const refList = this.refListEl[i];
              if (!refList) {
                return;
              }
              const { y } = s;
              refList.style.transform = `translateY(${y}px)`;
            }}
          >
            <ul>
              {extraLi}
              {list.map((item, idx) => {
                return (
                  <li styleName="item" key={idx} data-index={idx}>
                    {item.label}
                  </li>
                );
              })}
              {extraLi}
            </ul>
          </ScrollView>
          <div styleName="picker-center-ul">
            <ul ref={(c) => (this.refListEl[i] = c)}>
            {/* {extraLi} */}
              {list.map((item, idx) => {
                return (
                  <li styleName="item" key={idx} data-index={idx}>
                    {item.label}
                  </li>
                );
              })}
              {/* {extraLi} */}
            </ul>
          </div>
        </div>
      );
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafTimer);
  }

  render() {
    const { className, style, columnTitle = [], data } = this.props;
    if (data.length === 0) {
      return null;
    }
    return (
      <div styleName={classNames(className, 'mc-picker')} style={style}>
        <div styleName="picker-scroll-header">
          {columnTitle.map((el, i) => {
            return (
              <div key={i} styleName="scroll-column-header">
                {el}
              </div>
            );
          })}
        </div>
        <div styleName="picker-main">
          <div
            styleName="picker-mask picker-mask-top"
            ref={(c) => (this.refTopItem = c)}
          />
          <div styleName="picker-mask picker-mask-bottom" />
          {this.makeScrollViews()}
          <div styleName="picker-highlight">
            {this.props.highlightChildren || null}
          </div>
        </div>
      </div>
    );
  }
}

export default BasePicker;
