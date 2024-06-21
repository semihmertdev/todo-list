import TodoApp from './todoApp';

export default class Dom {
  constructor() {
    this.app = new TodoApp();
    this.init();
  }

  init() {
    document.getElementById('add-project').addEventListener('click', () => this.addProject());
    document.getElementById('show-form-btn').addEventListener('click', () => this.toggleFormVisibility());
    document.getElementById('add-todo-form').addEventListener('submit', (event) => this.addTodo(event));
    this.render();
  }

  addProject() {
    const projectName = prompt('Enter the new project name:');
    if (projectName) {
      this.app.addProject(projectName);
      this.render();
    }
  }

  toggleFormVisibility() {
    const form = document.getElementById('add-todo-form');
    form.classList.toggle('hidden');
  }

  addTodo(event) {
    event.preventDefault();
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();
    const dueDate = document.getElementById('todo-dueDate').value;
    const priority = document.getElementById('todo-priority').value;
    const tagName = this.app.currentProject ? this.app.currentProject.name : 'Default';
    if (title && description && dueDate) {
      this.app.addTodo(title, description, dueDate, priority, tagName);
      this.render();
      this.clearForm();
      this.toggleFormVisibility(); // Hide form after adding todo
    } else {
      alert('Please fill out all fields.');
    }
  }

  clearForm() {
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-description').value = '';
    document.getElementById('todo-dueDate').value = '';
    document.getElementById('todo-priority').value = 'Low';
  }

  render() {
    this.renderProjects();
    this.renderTodos();
  }

  renderProjects() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    // Render Default project first
    const defaultProject = this.app.projects['Default'];
    if (defaultProject) {
      const defaultLi = document.createElement('li');
      defaultLi.textContent = 'Default';
      defaultLi.id = 'default-project';
      defaultLi.addEventListener('click', () => {
        this.app.switchProject('Default');
        this.render();
      });
      projectList.appendChild(defaultLi);
    }

    // Render other projects
    this.app.getProjects().forEach(projectName => {
      if (projectName !== 'Default') {
        const li = document.createElement('li');
        li.textContent = projectName;
        li.classList.add('project-item'); // Add project-item class
        li.id = projectName.toLowerCase(); // Set id to lowercase project name
        li.addEventListener('click', () => {
          this.app.switchProject(projectName);
          this.render();
        });
        projectList.appendChild(li);
      }
    });
  }

  renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    this.app.getCurrentProjectTodos().forEach((todo, index) => {
      const li = document.createElement('li');
      li.classList.add('todo-item'); // Add todo-item class
      li.id = `todo-${todo.id}`; // Set unique id for each todo

      const titleSpan = document.createElement('span');
      titleSpan.textContent = `${todo.title} - ${todo.dueDate}`;
      titleSpan.classList.add('todo-title'); // Add todo-title class
      li.appendChild(titleSpan);

      const tagSpan = document.createElement('span');
      tagSpan.textContent = `(${todo.tagName})`; // Display tagName
      tagSpan.classList.add('tag'); // Add tag class
      li.appendChild(tagSpan);

      if (todo.completionStatus) {
        li.classList.add('completed'); // Add completed class for completed todos
      }

      // Apply priority-based classes
      switch (todo.priority.toLowerCase()) {
        case 'high':
          li.classList.add('priority-high');
          break;
        case 'medium':
          li.classList.add('priority-medium');
          break;
        case 'low':
        default:
          li.classList.add('priority-low'); // Default to low priority
          break;
      }

      li.addEventListener('click', () => {
        this.app.toggleComplete(index);
        this.render();
      });

      todoList.appendChild(li);
    });
  }
}
