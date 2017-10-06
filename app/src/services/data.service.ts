import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()

/**
 * データ管理
 */
export class DataService {

  public data: any;
  // private data$: Observable<any>;
  private data$: BehaviorSubject<any>;
  constructor() {
    this.data$ = new BehaviorSubject<any>({});
  }

  /**
   * データのセット
   * @param data
   */
  setData(data: any) {
    this.data = data;
    this.data$.next(this.data);
    this.data$.complete();
  }

  /**
   * アイテムの取得
   * @param path
   * @returns {any}
   */
  getItem(path: string): any {
    return this.data[path];
  }

  /**
   * アイテムの取得
   */
  getItem$(path: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.data$.subscribe((data) => {
        console.log("-- send data", data[path]);
        observer.next(data[path] || "dummy");
        observer.complete();
      });
    });
  }

  /**
   * テキストの取得
   * @param path
   * @returns {Promise<T>}
   */
  getText(path: string): Promise<string> {
    return new Promise(resolve => {
      const blob = this.b64toBlob(this.data[path], "text/plain", 512);
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        const event: any = e.srcElement;
        resolve(event.result);
      });
      reader.readAsText(blob);
    });
  }

  /**
   * テキストの取得
   */
  getText$(path: string): Observable<string> {
    return Observable.create(observer => {
      this.data$.subscribe((data) => {
        const blob = this.b64toBlob(this.data[path], "text/plain", 512);
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
          const event: any = e.srcElement;
          observer.next(event.result);
          observer.complete();
        });
        reader.readAsText(blob);
        observer.next(data[path]);
        observer.complete();
      });
    });
  }

  /**
   * baset64をBlobに変換
   * https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
   * @param b64Data
   * @param contentType
   * @param sliceSize
   * @returns {Blob}
   */
  private b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}