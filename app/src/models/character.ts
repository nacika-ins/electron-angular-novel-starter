/**
 * キャラクター
 */
export class Character {
  private name: string;
  private images: { [key: string]: string };
  public isShow: boolean = false;
  private x: number;
  private y: number;
  private currentImageMode: string = 'default';
  constructor(name: string, images: { [key: string]: string }, offset: { x: number, y: number }) {
    this.name = name;
    this.images = images;
    this.x = offset.x;
    this.y = offset.y;
  }

  /**
   * キャラクターの表示
   */
  show(imageMode: string) {
    this.isShow = true;
    this.currentImageMode = imageMode;
    console.log(this.currentImageMode);
  }

  /**
   * キャラクターの非表示
   */
  hide() {
    this.isShow = false;
    this.currentImageMode = 'default';
  }

  /**
   * 画像パスの取得
   */
  getImage(): string {
    return this.images[this.currentImageMode];
  }

  /**
   * イメージモードの取得
   */
  getImageMode(): string {
    return this.currentImageMode || 'default';
  }

  /**
   * JSONから作成
   */
  static createByRow(row: any): Character {
    let character = new Character(row.name, row.images, { x: row.x, y: row.y });
    character.currentImageMode = row.currentImageMode;
    character.isShow = row.isShow;
    return character;
  }

  /**
   * オフセットサイズXの取得
   */
  getOffsetX(): number {
    return this.x || 0;
  }

  /**
   * オフセットサイズYの取得
   */
  getOffsetY(): number {
    return this.y || 0;
  }


}