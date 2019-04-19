import * as React from 'react';
import CSSModules from '@utils/cssmodules';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import * as styles from './emoji.css';

@CSSModules(styles)
export default class EmojiItem extends React.Component<{
  src: string;
  gif: string;
  onSelect?: (src: string) => void;
}, {popoverShow: boolean}> {

  state = {
    popoverShow: false,
  };

  toggleShow = (show: boolean = true) => {
    this.setState({ popoverShow: show });
  }

  render() {
    const { popoverShow } = this.state;
    const { onSelect, gif } = this.props;
    return (
      <Popover
        isOpen={popoverShow}
        content={({ position, targetRect, popoverRect }) => (
          <ArrowContainer
            position={position}
            targetRect={targetRect}
            popoverRect={popoverRect}
            arrowColor={'#eee'}
            arrowSize={5}
          >
           <EmojiContent gif={gif}/>
          </ArrowContainer>
        )}
      >
        <li
          onClick={() => onSelect && onSelect(gif)}
          // onMouseEnter={() => this.toggleShow()}
          onMouseLeave={() => this.toggleShow(false)}
        >
          <img src={gif} alt="" />
        </li>
      </Popover>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
@CSSModules(styles)
class EmojiContent extends React.Component<{gif: string}> {

  render() {
    return (
      <div styleName="pop-img">
        <img src={this.props.gif} alt=""/>
      </div>
    );
  }
}
