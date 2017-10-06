import { Character } from '../models/character';
import * as _ from "lodash";
import {ElementRef, NgZone, Renderer2} from '@angular/core';
import {NovelService} from '../services/novel.service';
import {SelectItem} from '../models/select-item';
import {CoverService} from '../services/cover.service';

export class GameController {

  private characters: { [key: string]: Character } = {};
  private backgroundImage: string;
  private oldBackgroundImage: string;
  private backgroundElement: ElementRef;
  private backgroundOverlapElement: ElementRef;
  private renderer: Renderer2;
  private zone: NgZone;
  private novelService: NovelService;
  private selectItems: Array<SelectItem> = [];
  public isAutoShowCharacter: boolean = true;
  private BGM: string;
  private coverService: CoverService;

  constructor() {
  }

  /**
   * コマンドの実行
   */
  execCommand(command: string): any {
    return eval("this.command__" + command);
  }

  /**
   * 現在表示できるキャラクターをリストで取得
   */
  getVisibleCharacters(): Array<Character> {
    return _(this.characters).filter((character: Character) => character.isShow).value();
  }

  /**
   * カバーサービスをセット
   */
  setCoverService(coverService: CoverService) {
    this.coverService = coverService;
  }

  /**
   * 選択肢を削除
   */
  removeAllSelectItems() {
    this.selectItems = [];
  }

  /**
   * キャラクター情報をJSONに変換
   */
  getCharacterToJSON() {
    return JSON.stringify(this.characters);
  }

  /**
   * 背景の取得
   */
  getBackGroundImage(): string {
    return this.backgroundImage;
  }

  /**
   * 古い背景の取得
   */
  getOldBackGroundImage(): string {
    return this.oldBackgroundImage;
  }

  /**
   * 背景要素のセット
   */
  setBackgroundElement(element: ElementRef) {
    this.backgroundElement = element;
  }

  /**
   * 上書き背景要素のセット
   */
  setBackgroundOverlapElement(element: ElementRef) {
    this.backgroundOverlapElement = element;
  }

  /**
   * JSONからキャラクターのセット
   */
  setCharactersByJson(charactersJson: string) {
    const object = JSON.parse(charactersJson);
    this.characters = _(object).map( row => [row.name, Character.createByRow(row)] ).fromPairs().value();
  }

  /**
   * レンダラーのセット
   */
  setRenderer(renderer: Renderer2) {
    this.renderer = renderer;
  }

  /**
   * zoneのセット
   */
  setZone(zone: NgZone) {
    this.zone = zone;
  }

  /**
   * ノベルサービスのセット
   */
  setNovelService(novelService: NovelService) {
    this.novelService = novelService;
  }

  /**
   * 選択肢の取得
   */
  getSelectItems(): Array<SelectItem> {
    return this.selectItems;
  }

  /**
   * BGMの取得
   */
  getBGM(): string {
    return this.BGM;
  }

  /**
   * 背景画像の変更
   */
  setBackGroundImage(path: string) {
    this.backgroundImage = path;
  }

  /**
   * キャラクターの登録
   */
  command__registerCharacter(name: string, images: { [key: string]: string }, offset: { x: number, y: number }) {
    _(images).each((value, key) => {
      images[key] = "images/" + value;
    });
    this.characters[name] = new Character(name, images, offset);
  }

  /**
   * キャラクターの表示
   */
  command__showCharacter(name: string, imageModeParam: string = "__inherit__", delay = 0) {
    if (name in this.characters) {
      let imageMode: string;
      if (imageModeParam == "__inherit__") {
        imageMode = this.characters[name].getImageMode();
      } else {
        imageMode = imageModeParam;
      }
      if (delay == 0) {
        this.characters[name].show(imageMode);
      } else {
        _.delay( () => {
          this.zone.run( () => {
            this.characters[name].show(imageMode);
          });
        }, delay);
      }
    }
  }

  /**
   * キャラクターの非表示
   */
  command__hideCharacter(name: string) {
    if (name in this.characters) {
      this.characters[name].hide();
    }
  }

  /**
   * 全てのキャラクターを非表示にする
   */
  command__disableAllCharacter() {
    _(this.characters).each((value, key) => {
      this.characters[key].hide();
    });
  }

  /**
   * 背景画像の変更
   */
  command__setBackGroundImage(path: string, style = "default") {
    if (this.backgroundImage) {
      this.oldBackgroundImage = this.backgroundImage;
      switch (style) {

        // 瞬間切り替え
        case "simple":
          this.backgroundImage = "images/" + path;
          break;

        // クロスフェード
        case "cross-fade":
        case "default":
        default:
          this.zone.run( () => {
            this.renderer.addClass(this.backgroundElement.nativeElement, "hide");
            this.zone.run( () => {
              this.backgroundImage = "images/" + path;
              this.zone.run( () => {
                this.renderer.addClass(this.backgroundElement.nativeElement, "up");
                _.delay(() => {
                  this.renderer.removeClass(this.backgroundElement.nativeElement, "up");
                  this.renderer.removeClass(this.backgroundElement.nativeElement, "hide");
                }, 2000);
              });
            });
          });
          break;
      }
    } else {
      this.backgroundImage = "images/" + path;
    }
  }

  /**
   * ラベルにジャンプ
   */
  command__goto(label: string) {
    _(this.novelService.goto(label));
  }

  /**
   * 選択肢の追加
   */
  command__addSelectItem(text: string, label: string) {
    this.selectItems.push(new SelectItem(text, label));
  }

  /**
   * 選択肢の削除
   */
  command__removeAllSelectItems() {
    this.selectItems = [];
  }

  /**
   * 自動キャラクター表示機能を無効にする
   */
  command__setAutoShowCharacter(flag: boolean) {
    this.isAutoShowCharacter = flag;
  }

  /**
   * カバー切り替え
   */
  command__coverWhiteGradation(speed: number) {
    this.coverService.whiteGradation(speed);
  }

  /**
   * 待機
   */
  command__sleep(ms: number): Promise<any> {
    return new Promise( resolve => {
      setTimeout( () => {
        resolve();
      }, ms);
    });
  }

  /**
   * BGMの再生
   */
  command__playBGM(path: string): Promise<any> {
    return new Promise( resolve => {
      this.BGM = "sounds/" + path;
      this.zone.run( () => {
        resolve();
      });
    });


  }




}