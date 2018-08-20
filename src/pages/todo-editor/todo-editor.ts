import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Todo, TodoManager, getNow, State } from '../../providers/todo-manager/todo-manager';

/**
 * Generated class for the TodoEditorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-todo-editor',
  templateUrl: 'todo-editor.html',
})
export class TodoEditorPage {
  todo: Todo;

  readonly minLimit: number;
  readonly maxLimit: number;
  readonly limitRange: number = 100;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public todoManager: TodoManager) {
    let todoTmp = Object.assign({}, this.navParams.get('target')) as Todo;
    this.todo = new Todo(
      todoTmp.id, todoTmp.task, todoTmp.limit, todoTmp.memo, todoTmp.state
    );

    // Limitの下限、上限用変数を設定
    let now = getNow();
    this.minLimit = now.getFullYear();
    this.maxLimit = this.minLimit + this.limitRange;

    if (!this.todo.limit) {
      // 現在時刻から時差を引いた値をISO形式の文字列に変換. その後、日付以降を削除.
      this.todo.limit = now.toISOString().replace(/T.*$/, '');
    }
  }

  onChangeOfLimit(newLimit: string) {
    this.todo.limit = newLimit;
    let isLimited = this.todo.isLimited();
    if (isLimited) {
      this.todo.state = this.todoManager.status.limited;
    } else if (!isLimited && this.todo.state === this.todoManager.status.limited) {
      // 期限内、かつ、状態が期限切れであれば、状態を通常にする
      this.todo.state = this.todoManager.status.normal;
    }
  }

  onChangeOfState(newStateName: string) {
    for (let key in this.todoManager.status) {
      if (newStateName === this.todoManager.status[key].name) {
        this.todo.state = this.todoManager.status[key];
        break;
      }
    }
  }

  isDisabledToState(state: State) {
    if (state === this.todoManager.status.onHold) {
      return false;
    } else if (state === this.todoManager.status.limited) {
      return true;
    } else {
      return this.todo.isExpired();
    }
  }

  done() {
    this.todoManager.set(this.todo).then(() => {
      this.navParams.get('callback')();
      console.log('Done!');
      this.navCtrl.pop();
    });
  }

  adjust(event) {
    let target = event.target;
    target.rows = this.getLines(this.todo.memo) + 1;
  }

  getLines(text: string, sep: string = '\n'): number {
    return text.split(sep).length;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodoEditorPage');
  }

}
