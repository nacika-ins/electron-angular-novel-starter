/**
 * セーブデータ
 */
export class SaveDataItem {
  private text: string;
  private position: number;

  constructor(position: number, text: string) {
    this.position = position;
    this.text = text;
  }

  /**
   * textの取得
   */
  getText(): string {
    return this.text;
  }

  /**
   * ポジションの取得
   */
  getPosition(): number {
    return this.position;
  }

}