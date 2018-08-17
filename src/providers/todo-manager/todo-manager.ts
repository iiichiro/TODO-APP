import { Injectable } from '@angular/core';
import { Storage } from '../../../node_modules/@ionic/storage';


const STATUS: {[key: string]: State} = {
  priority: {name: "優先", value:   2, color: "priority"},
  limited:  {name: "期限切れ", value: 255, color: "limited"},
  normal:   {name: "通常", value:   0, color: ""},
  onHold:   {name: "保留", value:  -1, color: "hold"}
};


export function getNow(): Date {
  // タイムゾーンの時差を取得
  let tz = (new Date()).getTimezoneOffset() * 60000;
  // 現在時刻から時差を引いた値をISO形式の文字列に変換. その後、日付以降を削除.
  return new Date(new Date(Date.now() - tz).toISOString().replace(/T.*$/, ''));
}

export class Todo {
  constructor(public id: number, public task: string,
              public limit: string, public memo: string, public state: State) {
    this.state = this.isLimited() ? STATUS.limited : this.state;
  }

  public isExpired() {
    let limit = new Date(this.limit);
    return (getNow().getTime() - limit.getTime()) > 0;
  }

  public isLimited() {
    // nameで同一かを確認しているため、注意
    return (this.state.name !== STATUS.onHold.name) && this.isExpired();
  }

  public toString(): string {
    return 'Todo' + this.id + '(' + this.task + ')';
  }
}

export interface State {
  name: string;
  value: number,
  color: string
}

/*
  Generated class for the TodoManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodoManager {
  readonly status: {[key: string]: State} = STATUS;

  statusList: State[] = [
    this.status.normal,
    this.status.priority,
    this.status.onHold,
    this.status.limited
  ];

  constructor(public storage: Storage) {
    console.log('Hello TodoManagerProvider Provider');
  }

  getStatusList() {
    return this.statusList;
  }

  load(todoList: Array<Todo>): void {
    this.storage.keys().then(keys => {
      let promiseList: Promise<void>[] = [];
      for (let key of keys) {
        promiseList.push(this.storage.get(key).then(data => {
          data = data as Todo;
          todoList.push(new Todo(data.id, data.task, data.limit, data.memo, data.state));
        }));
      }
      Promise.all(promiseList).then(() => {
        todoList.sort((a, b) => {
          let res = b.state.value - a.state.value;
          if (res === 0) {
            return new Date(a.limit).getTime() - new Date(b.limit).getTime();
          } else {
            return res;
          }
        });
      });
    });
  }

  get(key: number): Promise<Todo> {
    return this.storage.get(key.toString());
  }

  set(todo: Todo): Promise<Todo> {
    console.log(todo);
    return this.storage.set(todo.id.toString(), todo);
  }

  create(): Promise<Todo> {
    return this.storage.keys().then(keys => {
      // keysをnumberに変換、NaNを取り除く、最大値を取得してidxに代入
      let idx = Math.max(...keys.map((s) => Number(s)).filter((n) => !Number.isNaN(n)), 0);
      return new Todo((idx?idx:0)+1, '', '', '', this.status.normal);
    })
  }

  delete(key: number): Promise<Todo> {
    return this.storage.remove(key.toString());
  }

}
