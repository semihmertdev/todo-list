import Todo from './todo';

export default class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  toggleComplete(todoId) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (todo) {
      todo.completionStatus = !todo.completionStatus;
    }
  }

  deleteTodo(todoId) {
    this.todos = this.todos.filter(todo => todo.id !== todoId);
  }
}