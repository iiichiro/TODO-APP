import { Injectable } from '@angular/core';
import { Storage } from '../../../node_modules/@ionic/storage';


export function getNow(): Date {
  // タイムゾーンの時差を取得
  let tz = (new Date()).getTimezoneOffset() * 60000;
  // 現在時刻から時差を引いた値をISO形式の文字列に変換. その後、日付以降を削除.
  return new Date(new Date(Date.now() - tz).toISOString().replace(/T.*$/, ''));
}

export class Todo {
  constructor(public id: number, public task: string,
              public limit: string, public memo: string) {
    console.log('create todo!');
  }

  public isExpired() {
    let limit = new Date(this.limit);
    return (getNow().getTime() - limit.getTime()) > 0
  }

  public toString(): string {
    return 'Todo' + this.id + '(' + this.task + ')'
  }
}

/*
  Generated class for the TodoManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodoManager {
  constructor(public storage: Storage) {
    console.log('Hello TodoManagerProvider Provider');
  }

  load(todoList: Array<Todo>): void {
    this.storage.keys().then(keys => {
      for (let key of keys) {
        this.storage.get(key).then(data => {
          data = data as Todo;
          todoList.push(new Todo(data.id, data.task, data.limit, data.memo));
        });
      }
    });
  }

  get(key: number): Promise<Todo> {
    return this.storage.get(key.toString());
  }

  set(todo: Todo): Promise<Todo> {
    return this.storage.set(todo.id.toString(), todo);
  }

  create(): Promise<Todo> {
    return this.storage.keys().then(keys => {
      // keysをnumberに変換、NaNを取り除く、最大値を取得してidxに代入
      let idx = Math.max(...keys.map((s) => Number(s)).filter((n) => !Number.isNaN(n)), 0);
      return new Todo((idx?idx:0)+1, '', '', '');
    })
  }

  delete(key: number): Promise<Todo> {
    return this.storage.remove(key.toString());
  }

}
