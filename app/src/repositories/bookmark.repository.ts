import {Injectable} from '@angular/core';
import * as lf from 'lovefield';
import * as _ from "lodash";
import {DBInfrastructure} from '../infrastructure/db.infrastructure';
import {SaveDataItem} from '../models/save-data-item';
@Injectable()
export class BookmarkRepository {
  constructor(
    private dbInfrastructure: DBInfrastructure
  ) {}

  /**
   * bookmarkの保存
   */
  insertBookmark(dto: {
    position: number,
    text: string,
    label: string,
    log: string,
    backgroundImage: string,
    characters: string,
    BGM: string,
    labelBackgroundImage: string,
    labelCharacters: string,
    labelBGM: string,
    labelLog: string,
    isAutoShowCharacter: boolean,
    labelIsAutoShowCharacter: boolean

  }) {
    this.dbInfrastructure.insertOrReplace('Bookmark', {
      'position': dto.position,
      'text': dto.text,
      'label': dto.label,
      'log': dto.log || "",
      'backgroundImage': dto.backgroundImage || "",
      'characters': dto.characters || {},
      'isAutoShowCharacter': dto.isAutoShowCharacter || false,
      'BGM': dto.BGM || "",
      'labelBackgroundImage': dto.labelBackgroundImage || "",
      'labelCharacters': dto.labelCharacters || "{}",
      'labelBGM': dto.labelBGM || "",
      'labelLog': dto.labelLog || "",
      'labelIsAutoShowCharacter': dto.labelIsAutoShowCharacter || false,
      'timestamp': Number(new Date())
    });
  }

  /**
   * bookmark一覧の取得
   */
  getBookmarks(): Promise<Array<SaveDataItem>> {
    return new Promise( resolve => {
      const db = this.dbInfrastructure.getDB();
      const bookmark = this.dbInfrastructure.getTable('Bookmark');
      db.select(bookmark.position, bookmark.text).from(bookmark).orderBy(bookmark.timestamp, lf.Order.DESC).exec().then( (rows) => {
        resolve(_(rows).map( row => new SaveDataItem(row.position, row.text)).value());
      });
    });
  }

  /**
   * bookmarkの取得
   */
  getBookmark(position: number): Promise<Array<any>> {
    return new Promise( resolve => {
      const db = this.dbInfrastructure.getDB();
      const bookmark = this.dbInfrastructure.getTable('Bookmark');
      db.select().from(bookmark).where(bookmark.position.eq(position)).exec().then( (rows) => {
        resolve(rows[0]);
      });
    });
  }

  /**
   * 一番古いブックマークの削除
   */
  removeOldBookmark(): Promise<any> {
    return new Promise( resolve => {
      const db = this.dbInfrastructure.getDB();
      const bookmark = this.dbInfrastructure.getTable('Bookmark');
      db.select(bookmark.position).from(bookmark).orderBy(bookmark.timestamp).limit(1).exec().then( (rows) => {
        if (rows.length) {
          if (rows[0].position !== undefined ) {
            db.delete().from(bookmark).where(bookmark.position.eq(rows[0].position)).exec().then( () => {
              resolve();
            });
          }
        }
      });
    });

  }

}