import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { NovelService } from '../../services/novel.service';
import { NovelLine } from '../../models/novel-line';
import { Router } from '@angular/router';
import { CoverService } from '../../services/cover.service';
import { Character } from '../../models/character';
import { GameController } from '../../controller/game.controller';
import * as _ from 'lodash';
import {BookmarkRepository} from '../../repositories/bookmark.repository';
import {SaveDataItem} from '../../models/save-data-item';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @ViewChild('background') backgroundElement: ElementRef;
  @ViewChild('backgroundOverlap') backgroundOverlapElement: ElementRef;
  @ViewChild('messageBox') messageBoxElement: ElementRef;
  @ViewChild('character') characterElement: ElementRef;
  @ViewChild('select') selectElement: ElementRef;
  @ViewChild('tools') toolsElement: ElementRef;
  @ViewChild('alert') alertElement: ElementRef;
  @ViewChild('saveDataLoadModal') saveDataLoadModalElement: ElementRef;
  @ViewChild('saveDataLoadConfirmModalLayer') saveDataLoadConfirmModalLayerElement: ElementRef;
  @ViewChild('logElm') logElement: ElementRef;

  private messageBoxImage: string;
  private loadButtonImage: string;
  private saveButtonImage: string;
  private logButtonImage: string;
  private configButtonImage: string;
  private messageContent: string;
  private isLockNextClick: boolean = false;
  private textSpeed: number = 50; // TODO: default: 50
  private messageTalkName: string;
  private gameController: GameController = new GameController();
  private isBackgroundMode: boolean = false;f
  private alertMessage: string;
  private oldLabel: string = "__init__";
  private labelBGM: string;
  private log: string = "";
  private labelBackgroundImage: string;
  private labelCharacterJSON: string;
  private labelLog: string = "";
  private saveDataItems: Array<SaveDataItem> = [];
  private isToolLock: boolean = false;
  private confirmSaveDataItem: SaveDataItem;
  private isShowSaveDataLoadModal: boolean = false;
  private isShowLog: boolean = false;
  private isSerifAnimation: boolean = false;
  private enableSavePosition: number;
  private enableSaveText: string;
  private labelIsAutoShowCharacter: boolean = false;
  private enableIsAutoShowCharacter: boolean = false;
  private playingBGM: any;
  constructor(
    private dataService: DataService,
    private zone: NgZone,
    private store: Store<AppState>,
    private novelService: NovelService,
    private router: Router,
    private coverService: CoverService,
    private renderer: Renderer2,
    private bookmarkRepository: BookmarkRepository
  ) {
    this.store.select<any>("data").subscribe(data => {
      this.messageBoxImage = this.dataService.getItem("images/novel__message-box.png");
      this.loadButtonImage = this.dataService.getItem("images/novel__load.png");
      this.saveButtonImage = this.dataService.getItem("images/novel__save.png");
      this.logButtonImage = this.dataService.getItem("images/novel__log.png");
      this.configButtonImage = this.dataService.getItem("images/novel__config.png");
      _.defer(() => {
        this.gameController.setNovelService(this.novelService);
        this.gameController.setZone(this.zone);
        this.gameController.setCoverService(this.coverService);
        this.next();
      });
    });
  }

  ngOnInit() {
  }

  /**
   * ロック状態かどうか
   */
  isLock(): boolean {
    return !this.isLockNextClick
      && !this.isBackgroundMode
      && !this.saveDataItems.length
      && !this.isToolLock
      && !this.isSerifAnimation
      && !this.gameController.getSelectItems().length;
  }

  /**
   * 画面をクリックした
   */
  onClickClickableArea() {
    console.log("clicked window");
    if (this.isLock()) {
      this.next();
    }
  }

  /**
   * ロードボタンを押した
   */
  onClickLoadButton() {
    this.isToolLock = true;
    this.isLockNextClick = true;
    this.isShowSaveDataLoadModal = true;
    this.bookmarkRepository.getBookmarks().then( saveDataItems => {
      if (saveDataItems.length) {
        this.saveDataItems = saveDataItems;
      }
    } );
  }

  /**
   * 保存ボタンを押した
   */
  onClickSaveButton() {
    if (!this.isToolLock) {
      this.isLockNextClick = true;
      if ( this.enableSavePosition !== undefined && this.enableSaveText ) {
        this.alertMessage = "セーブしました";
        this.bookmarkRepository.insertBookmark({
          position: this.enableSavePosition,
          text: this.enableSaveText,
          label: this.oldLabel,
          log: this.log,
          backgroundImage: this.gameController.getBackGroundImage(),
          characters: this.gameController.getCharacterToJSON(),
          BGM: this.gameController.getBGM(),
          labelBackgroundImage: this.labelBackgroundImage,
          labelCharacters: this.labelCharacterJSON,
          labelBGM: this.labelBGM,
          labelLog: this.labelLog,
          isAutoShowCharacter: this.enableIsAutoShowCharacter,
          labelIsAutoShowCharacter: this.labelIsAutoShowCharacter
        });
        this.bookmarkRepository.getBookmarks().then( saveDataItems => {
          if (saveDataItems.length > 100) {
            this.bookmarkRepository.removeOldBookmark();
          }
        } );
      } else {
        this.alertMessage = "セーブ出来ません";
      }
      _.defer( () => {
        this.isLockNextClick = false;
      });
      _.delay( () => {
        this.alertMessage = null;
      }, 2000);
    }
  }

  /**
   * セーブデータの読み込みが確定された
   */
  onClickConfirmSaveDataItem(result: boolean) {
    this.isLockNextClick = true;
    if (result) {
      this.bookmarkRepository.getBookmark(this.confirmSaveDataItem.getPosition()).then( (row: any) => {
        switch(this.novelService.gotoBySaveData(row)) {
          case "position":
            this.gameController.removeAllSelectItems();
            this.gameController.setBackGroundImage(row.backgroundImage);
            this.log = this.labelLog = row.log;
            this.gameController.setCharactersByJson(row.characters);
            this.gameController.isAutoShowCharacter = row.isAutoShowCharacter;

            if (row.BGM != "") {
              if (this.playingBGM) {
                this.playingBGM.pause();
                this.playingBGM.currentTime = 0;
              }
              console.log(row.BGM);
              this.playingBGM = new Audio(this.dataService.getItem(row.BGM));
              this.playingBGM.loop = true;
              this.playingBGM.play();
            }

            this.next(false);
            break;
          case "label":
            this.gameController.removeAllSelectItems();
            this.gameController.setBackGroundImage(row.labelBackgroundImage);
            this.log = this.labelLog = row.labelLog;
            this.gameController.setCharactersByJson(row.labelCharacters);
            this.gameController.isAutoShowCharacter = row.labelIsAutoShowCharacter;

            if (row.labelBGM != "") {
              if (this.playingBGM) {
                this.playingBGM.pause();
                this.playingBGM.currentTime = 0;
              }
              this.playingBGM = new Audio(this.dataService.getItem(row.labelBGM));
              this.playingBGM.loop = true;
              this.playingBGM.play();
            }

            this.next(false);
            break;
        }
      });
      this.saveDataItems = [];
      _.defer( () => {
        this.isLockNextClick = false;
        this.isToolLock = false;
        this.isShowSaveDataLoadModal = false;
      });
    }
    this.confirmSaveDataItem = null;
  }

  /**
   * セーブアイテムをクリックした
   */
  onClickSaveItem(saveDataItem: SaveDataItem) {
    this.isLockNextClick = true;
    this.confirmSaveDataItem = saveDataItem;
  }

  /**
   * セーブデータモーダルを閉じた
   */
  onClickSaveDataModalCloseButton() {
    this.isLockNextClick = true;
    this.saveDataItems = [];
    _.defer( () => {
      this.isLockNextClick = false;
      this.isToolLock = false;
      this.isShowSaveDataLoadModal = false;
    });
  }

  /**
   * ログボタンを押した
   */
  onClickLogButton() {
    this.isLockNextClick = true;
    if (!this.isToolLock) {
      this.isShowLog = true;
    }
    _.defer( () => {
      this.isLockNextClick = false;
    });
  }

  /**
   * ログを閉じた
   */
  onClickCloseLog() {
    this.isLockNextClick = true;
    _.defer( () => {
      this.isLockNextClick = false;
      this.isShowLog = false;
    });
  }

  /**
   * 設定ボタンを押した
   */
  onClickConfigButton() {
    if (!this.isToolLock) {

    }
  }

  /**
   * 右クリックが押された
   */
  onContextMenu() {
    if (this.isBackgroundMode) {
      this.isBackgroundMode = false;
      this.renderer.removeClass(this.messageBoxElement.nativeElement, 'hide');
      this.renderer.removeClass(this.characterElement.nativeElement, 'hide');
      this.renderer.removeClass(this.selectElement.nativeElement, 'hide');
      this.renderer.removeClass(this.toolsElement.nativeElement, 'hide');
      this.renderer.removeClass(this.alertElement.nativeElement, 'hide');
      this.renderer.removeClass(this.saveDataLoadModalElement.nativeElement, 'hide');
      this.renderer.removeClass(this.saveDataLoadConfirmModalLayerElement.nativeElement, 'hide');
      this.renderer.removeClass(this.logElement.nativeElement, 'hide');
    } else {
      this.isBackgroundMode = true;
      this.renderer.addClass(this.messageBoxElement.nativeElement, 'hide');
      this.renderer.addClass(this.characterElement.nativeElement, 'hide');
      this.renderer.addClass(this.selectElement.nativeElement, 'hide');
      this.renderer.addClass(this.toolsElement.nativeElement, 'hide');
      this.renderer.addClass(this.alertElement.nativeElement, 'hide');
      this.renderer.addClass(this.saveDataLoadModalElement.nativeElement, 'hide');
      this.renderer.addClass(this.saveDataLoadConfirmModalLayerElement.nativeElement, 'hide');
      this.renderer.addClass(this.logElement.nativeElement, 'hide');
    }
  }

  /**
   * 選択肢を押した
   */
  onClickSelectItem(label: string) {
    if (this.novelService.goto(label)) {
      this.oldLabel = label;
    };
    this.gameController.command__removeAllSelectItems();
    this.isLockNextClick = false;
  }

  /**
   * 次へ進んだ
   */
  next(isRecordLog: boolean = true) {

    if (this.novelService.hasNext()) {
      const currentLine: NovelLine = this.novelService.next();
      if (currentLine.isCommand()) {
        const command = currentLine.getText();
        let cmd: any;
        // コマンド行
        switch(command.replace(/\(.*\)?/g, "")) {

          case "sleep":
            cmd = this.gameController.execCommand(command);
            cmd.then( () => {
              this.next();
            });
            break;

          case "playBGM":
            cmd = this.gameController.execCommand(command).then( () => {
              const bgm = this.dataService.getItem(this.gameController.getBGM());

              if (this.playingBGM) {
                this.playingBGM.pause();
                this.playingBGM.currentTime = 0;
              }

              console.assert(bgm.indexOf("audio") !== -1, "audio loading error");
              this.playingBGM = new Audio(bgm);
              this.playingBGM.loop = true;
              this.playingBGM.play();
              this.next();
            });
            break;

          case "waitSelecting":
            this.isLockNextClick = true;
            break;

          default:
            this.gameController.execCommand(command);
            this.next();
            break;
        }
      } else if (currentLine.isSerif()) {
        // セリフ行
        if (isRecordLog) {
          this.enableSavePosition = this.novelService.getCurrentLinePosition();
          this.enableSaveText = this.novelService.getCurrentText();
          this.log += "「" + currentLine.getText() + "」\n";
        }
        this.isLockNextClick = true;
        currentLine.getTextAnimation$(this.textSpeed).subscribe(text => {
          this.isSerifAnimation = true;
          this.messageTalkName = currentLine.getTalkName();
          if (this.messageTalkName != "") {
            if (this.gameController.isAutoShowCharacter) {
              this.gameController.command__showCharacter(this.messageTalkName);
            }
          }
          this.messageContent = text;
        }, () => { }, () => {
          this.isLockNextClick = false;
          this.isSerifAnimation = false;
        });
      } else if (currentLine.isLabel()) {
        // ラベル行
        this.oldLabel = currentLine.getText();
        this.labelBackgroundImage = this.gameController.getBackGroundImage();
        this.labelCharacterJSON = this.gameController.getCharacterToJSON();
        this.labelIsAutoShowCharacter = this.gameController.isAutoShowCharacter;
        this.labelBGM = this.gameController.getBGM();
        this.labelLog = this.log;
        this.next();
      } else if (currentLine.isComment()) {
        // コメント行
        this.next();
      } else if (currentLine.isSpace()) {
        // 空白行
        this.next();
      } else {
        // ナレーション行
        this.isLockNextClick = true;
        this.isSerifAnimation = true;
        if (isRecordLog) {
          this.enableSavePosition = this.novelService.getCurrentLinePosition();
          this.enableSaveText = this.novelService.getCurrentText();
          this.enableIsAutoShowCharacter = this.gameController.isAutoShowCharacter;
          this.log += currentLine.getText(false) + "\n";
        }
        currentLine.getTextAnimation$(this.textSpeed).subscribe(text => {
          this.messageTalkName = "";
          this.messageContent = text;
        }, () => { }, () => {
          this.isLockNextClick = false;
          this.isSerifAnimation = false;
        });
      }
    } else {
      // エンドロール
      this.coverService.whiteGradation().then(() => {
        if (this.playingBGM) {
          this.playingBGM.pause();
          this.playingBGM.currentTime = 0;
          this.novelService.reset();
          this.log = "";
          this.labelLog = "";
          this.oldLabel = "__init__";
        }
        this.router.navigate(["./start"]);
      });
    }
  }

  ngAfterViewInit() {
    this.gameController.setBackgroundElement(this.backgroundElement);
    this.gameController.setBackgroundOverlapElement(this.backgroundOverlapElement);
    this.gameController.setRenderer(this.renderer);
  }

}
