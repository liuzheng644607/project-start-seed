// Type definitions for iScroll 5.2
// Project: http://cubiq.org/iscroll-5-ready-for-beta-test
// Definitions by: Christiaan Rakowski <https://github.com/csrakowski>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface IScrollOptions {
  x?: number;
  y?: number;
  bounce?: boolean;
  bounceLock?: boolean;
  momentum?: boolean;
  lockDirection?: boolean;
  useTransform?: boolean;
  useTransition?: boolean;
  topOffset?: number;
  checkDOMChanges?: boolean;
  handleClick?: boolean;

  // Scrollbar
  hScrollbar?: boolean;
  vScrollbar?: boolean;
  fixedScrollbar?: boolean;
  hideScrollbar?: boolean;
  fadeScrollbar?: boolean;
  scrollbarClass?: string;

  // Zoom
  zoom?: boolean;
  zoomMin?: number;
  zoomMax?: number;
  doubleTapZoom?: number;
  mouseWheel?: boolean;
  wheelAction?: string;
  snap?: string | boolean;
  snapThreshold?: number;
  snapStepY?: number;

  // New in IScroll 5?
  resizeIndicator?: boolean;
  mouseWheelSpeed?: number;
  startX?: number;
  startY?: number;
  scrollX?: boolean;
  scrollY?: boolean;
  scrollbars?: boolean | string;
  shrinkScrollbars?: string;
  interactiveScrollbars?: boolean;
  releaseScroll?: boolean;
  fadeScrollbars?: boolean;
  directionLockThreshold?: number;

  bounceTime?: number;

  // String or function
  bounceEasing?: string | { style: string; fn: (k: {}) => {} };

  preventDefault?: boolean;
  preventDefaultException?: RegExp[] | object;

  HWCompositing?: boolean;

  freeScroll?: boolean;

  resizePolling?: number;
  tap?: boolean;
  click?: boolean;
  invertWheelDirection?: boolean;
  eventPassthrough?: string | boolean;

  // iScroll probe edition
  probeType?: number;

  // Pointer events
  disableMouse?: boolean;
  disablePointer?: boolean;
  disableTouch?: boolean;
}

export class IScroll {
  constructor(element: string | HTMLElement, options?: IScrollOptions);
  wrapper: HTMLElement;
  // current position
  x: number;
  y: number;
  // last direction (-1 down/right, 0 still, 1 up/left)
  directionX: number;
  directionY: number;
  currentPage: {
    x: number;
    y: number;
    pageY: number;
    pageX: number;
  };
  pages: Array<
    Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      cx: number;
      cy: number;
    }>
  >;
  minScrollY: number;
  maxScrollY: number;
  minScrollX: number;
  maxScrollX: number;

  destroy(): void;

  refresh(): void;

  scrollTo(x: number, y: number, time?: number, relative?: boolean): void;

  scrollToElement(element: string | HTMLElement, time?: number): void;
  scrollToElement(
    element: HTMLElement,
    time?: number,
    offsetX?: number | boolean,
    offsetY?: number | boolean,
    easing?: () => void
  ): void;

  goToPage(pageX: number, pageY: number, time?: number): void;

  disable(): void;

  enable(): void;

  stop(): void;

  zoom(x: number, y: number, scale: number, time?: number): void;

  isReady(): boolean;

  // Events
  on(type: string, fn: (evt?: {}) => void): void;

  off(type: string, fn?: (evt?: {}) => void): void;
}
