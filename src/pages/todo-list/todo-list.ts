import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Todo, TodoManager } from '../../providers/todo-manager/todo-manager';
import { TodoEditorPage } from '../todo-editor/todo-editor';

/**
 * Generated class for the TodoListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-todo-list',
  templateUrl: 'todo-list.html',
})
export class TodoListPage {
  todoList: Array<Todo> = Array();


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public todoManager: TodoManager) {
    this.loadTodo();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodoListPage');
  }

  loadTodo() {
    this.todoList = [];
    this.todoManager.load(this.todoList);
  }

  editTodo(todo: Todo | Promise<Todo>) {
    let func = (todo: Todo) => this.navCtrl.push(TodoEditorPage, {target: todo, callback: () => this.loadTodo()});
    if (todo instanceof Promise) {
      todo.then(todo => func(todo));
    } else {
      func(todo);
    }
  }

  createTodo() {
    return this.todoManager.create();
  }

  deleteTodo(todo: Todo) {
    return this.todoManager.delete(todo.id).then(() => {
      this.todoList = this.todoList.filter(t => t != todo);
    });
  }
}
