import * as React from 'react';
import CSSModules from '@utils/cssmodules';
import * as styles from './emoji.css';
import EmojiItem from './EmojiItem';

interface IProps {
  onSelect?: (src: string) => void;
}

@CSSModules(styles)
export default class extends React.Component<IProps> {
  componentDidMount() {}

  onSelect = (src: string) => {
    if (this.props.onSelect) {
      this.props.onSelect(src);
    }
  }

  render() {
    return (
      <div styleName="emoji-box">
        <div styleName="emoji-list">
          <ul>
            {Array(221)
              .fill(0)
              .map((i, index) => {
                let src = '';
                let gif = '';
                try {
                  src = require(`@assets/emoji/${index}fix@2x.png`);
                  gif = require(`@assets/emoji/${index}@2x.gif`);
                } catch (e) {}
                return !gif ? null : (
                  <EmojiItem key={i} src={src} gif={gif} onSelect={this.onSelect} />
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}
