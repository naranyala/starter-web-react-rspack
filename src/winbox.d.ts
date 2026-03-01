declare module 'winbox/src/js/winbox.js' {
  interface WinBoxParams {
    id?: string;
    index?: number;
    root?: HTMLElement;
    template?: HTMLElement;
    title?: string;
    icon?: string;
    mount?: HTMLElement;
    html?: string;
    url?: string;
    width?: number | string;
    height?: number | string;
    minwidth?: number | string;
    minheight?: number | string;
    maxwidth?: number | string;
    maxheight?: number | string;
    autosize?: boolean;
    overflow?: boolean;
    min?: boolean;
    max?: boolean;
    hidden?: boolean;
    modal?: boolean;
    x?: number | string;
    y?: number | string;
    top?: number | string;
    left?: number | string;
    bottom?: number | string;
    right?: number | string;
    background?: string;
    border?: number;
    header?: number;
    class?: string | string[];
    oncreate?: (this: WinBox) => void;
    onclose?: (this: WinBox, force?: boolean) => boolean | void;
    onfocus?: (this: WinBox) => void;
    onblur?: (this: WinBox) => void;
    onmove?: (this: WinBox, x: number, y: number) => void;
    onresize?: (this: WinBox, width: number, height: number) => void;
    onfullscreen?: (this: WinBox, state: boolean) => void;
    onmaximize?: (this: WinBox, state: boolean) => void;
    onminimize?: (this: WinBox, state: boolean) => void;
    onrestore?: (this: WinBox) => void;
    onhide?: (this: WinBox) => void;
    onshow?: (this: WinBox) => void;
    onload?: (this: WinBox) => void;
  }

  class WinBox {
    constructor(params?: WinBoxParams);
    
    id: string;
    window: HTMLElement;
    body: HTMLElement;
    index: number;
    min: boolean;
    max: boolean;
    full: boolean;
    hidden: boolean;
    focused: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;

    mount(element: HTMLElement): WinBox;
    unmount(): WinBox;
    move(x: number | string, y: number | string): WinBox;
    resize(width: number | string, height: number | string): WinBox;
    close(force?: boolean): boolean;
    focus(): WinBox;
    blur(): WinBox;
    hide(): WinBox;
    show(): WinBox;
    minimize(state?: boolean): WinBox;
    maximize(state?: boolean): WinBox;
    fullscreen(state?: boolean): WinBox;
    restore(): WinBox;
    setBackground(background: string): WinBox;
    setTitle(title: string): WinBox;
    setIcon(icon: string): WinBox;
    setUrl(url: string, onload?: () => void): WinBox;
    addControl(element: HTMLElement): WinBox;
    removeControl(element: HTMLElement): WinBox;
    addClass(classname: string): WinBox;
    removeClass(classname: string): WinBox;
    toggleClass(classname: string): WinBox;
    hasClass(classname: string): boolean;

    static stack: WinBox[];
    static new(params?: WinBoxParams): WinBox;
  }

  export default WinBox;
}
