import Todo from './todo';

export default class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  toggleComplete(id) {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completionStatus = !todo.completionStatus;
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
