import { Action } from '@ngrx/store';
import { DataAction } from '../actions/data.action';

export function dataReducer(state: any = {}, action: DataAction) {
  switch (action.type) {
    case DataAction.DATA_SET:
      return state = action.data;
    default:
      return state;
  }
}