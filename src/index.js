import './style.css';

class TodoApp {
  constructor() {
    this.todos = [];
    this.addTodo = this.addTodo.bind(this);
    this.render();
  }

  addTodo() {
    const todoText = document.querySelector('#todoInput').value;
    if (todoText) {
      this.todos.push(todoText);
      document.querySelector('#todoInput').value = '';
      this.render();
    }
  }

  render() {
    const app = document.querySelector('#app');
    app.innerHTML = `
      <h1>ToDo App</h1>
      <input type="text" id="todoInput" placeholder="New ToDo">
      <button id="addTodoBtn">Add ToDo</button>
      <ul>
        ${this.todos.map(todo => `<li class="todo">${todo}</li>`).join('')}
      </ul>
    `;

    document.querySelector('#addTodoBtn').addEventListener('click', this.addTodo);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});
