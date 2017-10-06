/**
 * 選択肢
 */
export class SelectItem {
  private text: string;
  private label: string;

  constructor(text: string, label: string) {
    this.text = text;
    this.label = label;
  }

  /**
   * キャラクターの表示
   */
  getText(): string {
    return this.text;
  }

  /**
   * クリックされると飛ぶ
   */
  getLabel(): string {
    return this.label;
  }

}