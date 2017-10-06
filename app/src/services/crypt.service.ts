import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import * as CryptoJS from 'crypto-js';
@Injectable()

/**
 * 暗号化・復号
 */
export class CryptService {

  constructor(private http: Http) { }

  decryptFile(path: string) {
    var self = this;
    console.log(path);
    return this.http.get(path, { responseType: ResponseContentType.Blob })
      .map((resp) => {
        let blob = resp.blob();
        return {
          data: new Blob([blob], {
            type: resp.headers.get("Content-Type")
          }),
          path: path
        };
      })
      .map((data) => {

        // var fileReader = new FileReader();
        // fileReader.onload = function() {
        //   const arrayBuffer = this.result;
        //   console.log(arrayBuffer, this);
        //   var input = CryptoJS.enc.
        //   const a = CryptoJS.AES.decrypt(arrayBuffer, "X6v+[4>F81%AT_me", {
        //     mode: CryptoJS.mode.CBC,
        //     padding: CryptoJS.pad.Pkcs7
        //   });
        //   console.log(data, a);
        // };
        // fileReader.readAsArrayBuffer(data.data);

        // const a = CryptoJS.AES.decrypt(data.data, "X6v+[4>F81%AT_me");
        // console.log(data, a);
        // return data;
      })
      ;
  }
}