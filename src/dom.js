import TodoApp from './todoApp';
import { format } from 'date-fns';

export default class Dom {
  constructor() {
    this.app = new TodoApp();
    this.currentEditTodoId = null;
    this.init();
  }

  init() {
    document.getElementById('add-project').addEventListener('click', () => this.addProject());
    document.getElementById('show-form-btn').addEventListener('click', () => this.toggleFormVisibility());
    document.getElementById('add-todo-form').addEventListener('submit', (event) => this.handleFormSubmit(event));
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

  handleFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();
    const dueDate = document.getElementById('todo-dueDate').value;
    const priority = document.getElementById('todo-priority').value;

    if (title && description && dueDate) {
      if (this.currentEditTodoId !== null) {
        // Edit existing todo
        const todo = this.app.getTodoById(this.currentEditTodoId);
        if (todo) {
          this.app.editTodo(this.currentEditTodoId, title, description, dueDate, priority);
          this.currentEditTodoId = null;
        }
      } else {
        // Add new todo
        const tagName = this.app.currentProject ? this.app.currentProject.name : 'Default';
        this.app.addTodo(title, description, dueDate, priority, tagName);
      }

      this.render();
      this.clearForm();
      this.toggleFormVisibility();
    } else {
      alert('Please fill out all fields.');
    }
  }

  clearForm() {
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-description').value = '';
    document.getElementById('todo-dueDate').value = '';
    document.getElementById('todo-priority').value = 'Low';
    this.currentEditTodoId = null;
  }

  editProject(projectName) {
    const newProjectName = prompt('Enter the new project name:');
    if (newProjectName) {
      this.app.editProject(projectName, newProjectName);
      this.render();
    }
  }

  deleteProject(projectName) {
    if (confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
      this.app.deleteProject(projectName);
      this.render();
    }
  }

  editTodo(todoId) {
    const todo = this.app.getTodoById(todoId);
    if (!todo) return;

    document.getElementById('todo-title').value = todo.title;
    document.getElementById('todo-description').value = todo.description;
    document.getElementById('todo-dueDate').value = todo.dueDate;
    document.getElementById('todo-priority').value = todo.priority;

    this.toggleFormVisibility();
    this.currentEditTodoId = todoId;
  }

  deleteTodo(todoId) {
    this.app.deleteTodo(todoId);
    this.render();
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

        // Edit Button for Project
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.editProject(projectName);
        });
        li.appendChild(editButton);

        // Delete Button for Project
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteProject(projectName);
        });
        li.appendChild(deleteButton);

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
    this.app.getCurrentProjectTodos().forEach((todo) => {
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

      // Edit Button for Todo
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-btn');
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editTodo(todo.id);
      });
      li.appendChild(editButton);

      // Delete Button for Todo
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteTodo(todo.id);
      });
      li.appendChild(deleteButton);

      li.addEventListener('click', () => {
        this.app.toggleComplete(todo.id);
        this.render();
      });

      todoList.appendChild(li);
    });
  }
}
