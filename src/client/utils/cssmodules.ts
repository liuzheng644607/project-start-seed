import * as CSSModule from 'react-css-modules';

interface TypeOptions {
  allowMultiple?: boolean;
  handleNotFoundStyleName?: 'throw' | 'log' | 'ignore';
}

export default function CSSModules(
  styles: Object,
  options?: TypeOptions | undefined,
) {
  const defaultOptions: TypeOptions = {
    allowMultiple: true,
    handleNotFoundStyleName: 'ignore',
  };

  return CSSModule(styles, Object.assign({}, defaultOptions, options));
}
