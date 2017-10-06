import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let dataService: DataService;
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [] });
    dataService = new DataService();
    dataService.setData({
      ".data/novels/sample.txt": "5LuK5pel44Gv44Gq44KT44Gm5ayJ44GX44GE5pel44Gg44KN44GG44CCCuODhuOCueODiOOAggohY2hhcmFjdGVyQS5zZXRJbWFnZSgnc2FtcGxlLnBuZycpCiFjaGFyYWN0ZXJBLnNldE5hbWUoJ+OCteODvOODkOODqycpCiFjaGFyYWN0ZXJBLnNldFBvc2l0aW9uKDEwLCAxMCkKIW1lc3NhZ2Vib3guY3VycmVudENoYXJhY3RlcihjaGFyYWN0ZXJBKQrjg4bjgrnjg4jjgIIK44GZ44GU44O844GECiFtZXNzYWdlQm94LnNsZWVwKDUwMDApCiF3b3JkLnNldFNwZWVkKDUwMDApCuODhuOCueODiAoKCg=="
    });
  });
  it('getText で テキストの読み込みが出来る', () => {
    const text = dataService.getText(".data/novels/sample.txt").then(text => {
      expect(text).toContain("すごーい");
    });

  });
});
