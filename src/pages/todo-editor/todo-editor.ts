import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Todo, TodoManager } from '../../providers/todo-manager/todo-manager';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public todoManager: TodoManager) {
    this.todo = Object.assign({}, this.navParams.get('target')) as Todo;

    if (!this.todo.limit) {
      // タイムゾーンの時差を取得
      let tz = (new Date()).getTimezoneOffset() * 60000;
      // 現在時刻から時差を引いた値をISO形式の文字列に変換. その後、日付以降を削除.
      this.todo.limit = new Date(Date.now() - tz).toISOString().replace(/T.*$/, '');
    }
  }

  done() {
    this.todoManager.set(this.todo).then(() => {
      this.navParams.get('callback')();
      console.log('Done!');
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodoEditorPage');
  }

}
