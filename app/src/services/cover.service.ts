import 'rxjs/add/operator/map';
import { ElementRef, Injectable, Injector, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

/**
 * カバー管理
 */
@Injectable()
export class CoverService {
  private elementRef: ElementRef;
  private renderer: Renderer2;
  constructor() { }

  /**
   * カバーエレメントのセット
   */
  setElement(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  /**
   * レンダラーのセット
   */
  setRenderer(renderrer: Renderer2) {
    this.renderer = renderrer;
  }

  /**
   * 白グラデーション開始
   * TODO: デフォルト: 2000
   */
  whiteGradation(speed: number = 2000): Promise<any> {
    return new Promise(resolve => {
      this.renderer.addClass(this.elementRef.nativeElement, 'up');
      setTimeout(() => {
        resolve();
        this.renderer.removeClass(this.elementRef.nativeElement, 'up');
        this.renderer.addClass(this.elementRef.nativeElement, 'down');
        setTimeout(() => {
          this.renderer.removeClass(this.elementRef.nativeElement, 'down');
        }, speed);
      }, speed);
    });

  }

}