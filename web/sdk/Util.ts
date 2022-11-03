import { Offset } from './interface';
import { Point } from './Point';

const PiBy180 = Math.PI / 180;
export class Util {
  /** 给元素添加类名 */
  static addClass(element: HTMLElement, className: string) {
    if ((' ' + element.className + ' ').indexOf(' ' + className + ' ') === -1) {
      element.className += (element.className ? ' ' : '') + className;
    }
  }

  /** 给元素设置样式 */
  static setStyle(element: HTMLElement, styles: string | Object) {
    let elementStyle = element.style;

    if (typeof styles === 'string') {
      element.style.cssText += ';' + styles;
      return styles.indexOf('opacity') > -1
        ? Util.setOpacity(element, styles.match(/opacity:\s*(\d?\.?\d*)/)![1])
        : element;
    }
    for (let property in styles) {
      if (property === 'opacity') {
        Util.setOpacity(element, styles[property]);
      } else {
        elementStyle[property] = styles[property];
      }
    }
    return element;
  }

  /** 设置元素透明度 */
  static setOpacity(element: HTMLElement, value: string) {
    element.style.opacity = value;
    return element;
  }

  /** 设置 css 的 userSelect 样式为 none，也就是不可选中的状态 */
  static makeElementUnselectable(element: HTMLElement): HTMLElement {
    element.style.userSelect = 'none';
    return element;
  }

  /** 计算元素偏移值 */
  static getElementOffset(element: any): Offset {
    let valueT = 0;
    let valueL = 0;
    do {
      valueT += element.offsetTop || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return { left: valueL, top: valueT };
  }

  /** 包裹元素并替换 */
  static wrapElement(element: HTMLElement, wrapper: HTMLElement | string, attributes: any) {
    if (typeof wrapper === 'string') {
      wrapper = Util.makeElement(wrapper, attributes);
    }
    if (element.parentNode) {
      element.parentNode.replaceChild(wrapper, element);
    }
    wrapper.appendChild(element);
    return wrapper;
  }

  /** 新建元素并添加相应属性 */
  static makeElement(tagName: string, attributes: any) {
    let el = document.createElement(tagName);
    for (let prop in attributes) {
      if (prop === 'class') {
        el.className = attributes[prop];
      } else {
        el.setAttribute(prop, attributes[prop]);
      }
    }
    return el;
  }

  /** 单纯的创建一个新的 canvas 元素 */
  static createCanvasElement() {
    const canvas = document.createElement('canvas');
    return canvas;
  }

  /** 获取鼠标的点击坐标，相对于页面左上角，注意不是画布的左上角，到时候会减掉 offset */
  static getPointer(event: Event, upperCanvasEl: HTMLCanvasElement) {
    event || (event = window.event as Event);

    let element: HTMLElement | Document = event.target as Document | HTMLElement;
    let body = document.body || { scrollLeft: 0, scrollTop: 0 };
    let docElement = document.documentElement;
    let orgElement = element;
    let scrollLeft = 0;
    let scrollTop = 0;
    let firstFixedAncestor;

    while (element && element.parentNode && !firstFixedAncestor) {
      element = element.parentNode as Document | HTMLElement;
      if (element !== document && Util.getElementPosition(element as HTMLElement) === 'fixed')
        firstFixedAncestor = element;

      if (
        element !== document &&
        orgElement !== upperCanvasEl &&
        Util.getElementPosition(element as HTMLElement) === 'absolute'
      ) {
        scrollLeft = 0;
        scrollTop = 0;
      } else if (element === document && orgElement !== upperCanvasEl) {
        scrollLeft = body.scrollLeft || docElement.scrollLeft || 0;
        scrollTop = body.scrollTop || docElement.scrollTop || 0;
      } else {
        scrollLeft += (element as HTMLElement).scrollLeft || 0;
        scrollTop += (element as HTMLElement).scrollTop || 0;
      }
    }

    return {
      x: Util.pointerX(event as MouseEvent) + scrollLeft,
      y: Util.pointerY(event as MouseEvent) + scrollTop,
    };
  }

  /** 获取元素位置 */
  static getElementPosition(element: HTMLElement) {
    return window.getComputedStyle(element, null).position;
  }

  static pointerX(event: MouseEvent) {
    return event.clientX || 0;
  }
  static pointerY(event: MouseEvent) {
    return event.clientY || 0;
  }

  /** 角度转弧度，注意 canvas 中用的都是弧度，但是角度对我们来说比较直观 */
  static degreesToRadians(degrees: number): number {
    return degrees * PiBy180;
  }

  /**
   * 将 point 绕 origin 旋转 radians 弧度
   * @param {Point} point 要旋转的点
   * @param {Point} origin 旋转中心点
   * @param {number} radians 注意 canvas 中用的都是弧度
   * @returns
   */
  static rotatePoint(point: Point, origin: Point, radians: number): Point {
    const sin = Math.sin(radians),
      cos = Math.cos(radians);

    point.subtractEquals(origin);

    const rx = point.x * cos - point.y * sin;
    const ry = point.x * sin + point.y * cos;

    return new Point(rx, ry).addEquals(origin);
  }

  /** 从数组中溢出某个元素 */
  static removeFromArray(array: any[], value: any) {
    let idx = array.indexOf(value);
    if (idx !== -1) {
      array.splice(idx, 1);
    }
    return array;
  }

  /**
   * 数组的最小值
   */
  static min(array: any[], byProperty = '') {
    if (!array || array.length === 0) return undefined;

    let i = array.length - 1,
      result = byProperty ? array[i][byProperty] : array[i];

    if (byProperty) {
      while (i--) {
        if (array[i][byProperty] < result) {
          result = array[i][byProperty];
        }
      }
    } else {
      while (i--) {
        if (array[i] < result) {
          result = array[i];
        }
      }
    }
    return result;
  }
  /**
   * 数组的最大值
   */
  static max(array: any[], byProperty = '') {
    if (!array || array.length === 0) return undefined;

    let i = array.length - 1,
      result = byProperty ? array[i][byProperty] : array[i];
    if (byProperty) {
      while (i--) {
        if (array[i][byProperty] >= result) {
          result = array[i][byProperty];
        }
      }
    } else {
      while (i--) {
        if (array[i] >= result) {
          result = array[i];
        }
      }
    }
    return result;
  }
}
