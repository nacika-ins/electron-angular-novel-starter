import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as _ from "lodash";
import { NovelLine } from '../models/novel-line';
@Injectable()

/**
 * ノベル管理
 */
export class NovelService {

  private novel: Array<string>;
  private currentLinePosition: number = 0;

  constructor() { }

  /**
   * ノベルデータの読み込み
   * 空白行と先頭が#で始まる行を省く
   */
  setNovel(text: string) {
    this.novel = _(text)
      .split("\n")
      .value();
  }

  /**
   * リセット
   */
  reset() {
    this.currentLinePosition = 0;
  }

  /**
   * 次へ進める
   */
  next(): NovelLine {
    const currentLine: NovelLine = new NovelLine(this.novel[this.currentLinePosition]);
    this.currentLinePosition += 1;
    return currentLine;
  }

  /**
   * 現在のテキストを取得
   */
  getCurrentText(): string {
    return this.novel[this.currentLinePosition-1];
  }

  /**
   * 次があるか確認する
   */
  hasNext(): boolean {
    return this.novel.length > this.currentLinePosition;
  }

  /**
   * ログの取得
   */
  getLog(): Array<string> {
    return _(this.novel).slice(0, this.currentLinePosition);
  }

  /**
   * 位置の移動
   */
  goto(label: string): boolean {
    if (label == "__init__") {
      this.currentLinePosition = 0;
      return true;
    } else {
      const position = _(this.novel).findIndex( line => _(line).trim() == "*" + label );
      if (position != -1) {
        this.currentLinePosition = position;
        return true;
      }
      return false;
    }
  }

  /**
   * SaveDataを元に位置の移動
   */
  gotoBySaveData(row: any): string {
    const line = this.novel[row.position];
    // 位置とその位置のテキストが一致した場合、ポジションを移動する
    if (line && line == row.text) {
      this.currentLinePosition = row.position;
      return "position";
    } else {
      return "label";
    }
  }

  /**
   * 現在位置の取得
   */
  getCurrentLinePosition(): number {
    return this.currentLinePosition - 1;
  }


}