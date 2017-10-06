import * as _ from "lodash";
import { Observable } from 'rxjs/Observable';

/**
 * ノベル行
 */
export class NovelLine {
  private line: string;
  constructor(text: string) {
    this.line = text;
  }

  /**
   * コマンドである
   */
  isCommand(): boolean {
    return this.line[0] == "!";
  }

  /**
   * ラベルである
   */
  isLabel(): boolean {
    return this.line[0] == "*";
  }

  /**
   * コメントである
   */
  isComment(): boolean {
    return this.line[0] == "#";
  }

  /**
   * 空白である
   */
  isSpace(): boolean {
    return _(this.line.replace(/　/g, "")).trim() == "";
  }

  /**
   * セリフである
   */
  isSerif(): boolean {
    if (this.isComment() || this.isComment() || this.isLabel()) {
      return false;
    } else {
      return this.line.indexOf("「") != -1 || this.line.indexOf("『") != -1;
    }
  }

  /**
   * セリフから発言者を取得
   */
  getTalkName(): string {
    return _(this.line.match(/([^「『]*)[「『]/)[1]).trim();
  }

  /**
   * テキストの取得
   */
  getText(isTrim = true): string {
    if (this.isSerif()) {
      return this.line.match(/[「『](.*)[」』]/)[1];
    } else if (this.isCommand()) {
      return _(this.line).trim().replace(/^!/, "");
    } else if (this.isLabel()) {
      return _(this.line).trim().replace(/^\*/, "");
    } else if (isTrim) {
      return _(this.line).trim();
    } else {
      return this.line;
    }
  }

  /**
   * テキストの取得
   */
  getRawText(): string {
    return _(this.line).trim();
  }

  /**
   * アニメーションして取得
   */
  getTextAnimation$(speed: number): Observable<string> {
    return Observable.create(observer => {
      const text = this.getText();
      const length = text.length;
      let position = 0;
      const timer = setInterval(() => {
        if (length < position) {
          clearInterval(timer);
          observer.complete();
        } else {
          const sendText: string = _(text).slice(0, position).value().join("");
          position += 1;
          observer.next(sendText);
        }
      }, speed);

    });
  }

}