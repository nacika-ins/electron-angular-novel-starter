import { Action } from '@ngrx/store';

export class DataAction implements Action {
  static DATA_SET = '[Data] Set';
  type: string;
  data: any;
};