import { Injectable } from '@angular/core';
import { Storage } from '../../../node_modules/@ionic/storage';


export class Todo {
  constructor(public id: number, public task: string,
              public limit: string, public memo: string) {
    console.log('create todo!');
  }

  toString(): string {
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
          todoList.push(data as Todo);
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
