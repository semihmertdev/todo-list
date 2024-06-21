import Todo from './todo';

export default class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  toggleComplete(index) {
    if (this.todos[index]) {
      this.todos[index].completionStatus = !this.todos[index].completionStatus;
    }
  }
}
