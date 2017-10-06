import { Component, ElementRef, NgZone, Renderer, Renderer2, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { Store } from '@ngrx/store';
import { DataAction } from '../actions/data.action';
import { DataState } from '../state/data.state';
import { AppState } from '../state/app.state';
import { Router } from '@angular/router';
import { CoverService } from '../services/cover.service';
import { NovelService } from '../services/novel.service';
import {DBInfrastructure} from '../infrastructure/db.infrastructure';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('cover') coverElement: ElementRef;

  constructor(
    private dataService: DataService,
    private store: Store<AppState>,
    private router: Router,
    private coverService: CoverService,
    private renderer: Renderer2,
    private zone: NgZone,
    private novelService: NovelService,
    private dbInfrastructure: DBInfrastructure

  ) {
    console.log('start application');
    electron.ipcRenderer.send("ready");
    electron.ipcRenderer.on('fileData', (event, data) => {
      console.log('recieve!', event, data);

      // データセット
      dataService.setData(data);

      // 画像取得テスト
      let a = dataService.getItem('images/sample1.png');
      console.assert(a.indexOf("image") !== -1, "audio loading error");
      a = null;

      // 音楽再生テスト wav
      let b = dataService.getItem('sounds/sample1.wav');
      console.assert(b.indexOf("audio") !== -1, "audio loading error");
      // let audio = new Audio(b);
      // audio.play();
      b = null;

      // 音楽再生テスト mp3
      let c = dataService.getItem('sounds/sample3.mp3');
      console.assert(c.indexOf("audio") !== -1, "audio loading error");
      // let audio2 = new Audio(c);
      // audio2.play();
      c = null;

      // ノベルデータの読み込み
      dataService.getText("novels/PiYvX2hy.txt").then(text => {
        novelService.setNovel(text);

        // データの保存
        this.store.dispatch({ type: DataAction.DATA_SET, data: data });

        // スタート画面へ移動
        this.coverService.whiteGradation().then(() => {
          this.router.navigate(["./start"]);
        });

        // レンダリングの開始
        setInterval(() => {
          this.zone.run(() => { });
        }, 10);

      });
    });

    // DB初期化
    dbInfrastructure.initialize();

    // ローディング画面
    this.router.navigate(["./loading"]);

  }

  ngAfterViewInit() {
    this.coverService.setElement(this.coverElement);
    this.coverService.setRenderer(this.renderer);
  }

}
