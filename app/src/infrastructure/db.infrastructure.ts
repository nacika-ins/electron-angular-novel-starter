import {Injectable} from '@angular/core';
import * as lf from 'lovefield';
@Injectable()
export class DBInfrastructure {

  private db: any;

  constructor() {}

  /**
   * 初期化
   * データは消えません
   */
  initialize(): Promise<any> {
    return new Promise (resolve  => {

      // ユーザーデータ
      const schemaBuilder = lf.schema.create('userData', 1);

      // ブックマーク
      // 位置とセリフが一致している行にジャンプ出来る
      // 一致していない場合、アップデートが行われた場合は、最後に通過したラベルにジャンプする
      // 背景はその時のどの設定になっているかわからないため保持する
      // キャラクターはそのときどの設定になっているかわからないため保持する
      // BGMはそのときどの設定になっているかわからないため保持する
      schemaBuilder.createTable('Bookmark')
        .addColumn('position', lf.Type.INTEGER)  // 保存時のポジション
        .addColumn('text', lf.Type.STRING) // 保存時のテキスト
        .addColumn('label', lf.Type.STRING) // 最後に通過したラベル
        .addColumn('log', lf.Type.STRING) // ログ
        .addColumn('timestamp', lf.Type.INTEGER) // タイムスタンプ
        .addColumn('backgroundImage', lf.Type.STRING)  // ポジション記憶時に使用されていたキャラクター情報の保持
        .addColumn('isAutoShowCharacter', lf.Type.BOOLEAN)  // キャラクター自動表示機能
        .addColumn('characters', lf.Type.STRING) // ポジション記憶時に使用されていたキャラクター情報の保持
        .addColumn('BGM', lf.Type.STRING) // ポジション記憶時に使用されていたBGM
        .addColumn('labelBackgroundImage', lf.Type.STRING) // ラベル記憶時に使用されていた背景画像の保持
        .addColumn('labelCharacters', lf.Type.STRING)  // ラベル記憶時に使用されていたキャラクター情報の保持
        .addColumn('labelBGM', lf.Type.STRING) // ラベル記憶時に使用されていたBGM
        .addColumn('labelLog', lf.Type.STRING) // ラベルまでのログ
        .addColumn('labelIsAutoShowCharacter', lf.Type.BOOLEAN)  // キャラクター自動表示機能
        .addPrimaryKey(['position']);

      let item;
      schemaBuilder.connect().then((db) => {
        this.db = db;
        // this.insertOrReplace('Bookmark', {
        //   'position': 16,
        //   'text': 'Get a cup of coffee',
        //   'saveLabel': 'umi'
        // });
      });
    });
  }

  /**
   * テーブルの取得
   */
  getTable(tableName: string): any {
    return this.db.getSchema().table(tableName);
  }

  /**
   * プライマリキーがなければ挿入
   */
  insertOrReplace(tableName: string, obj: any) {
    const table = this.getTable(tableName);
    let row = table.createRow(obj);
    this.db.insertOrReplace().into(table).values([row]).exec();
  }

  /**
   * dbの取得
   */
  getDB(): any {
    return this.db;
  }

}