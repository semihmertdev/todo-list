import TodoApp from './todoApp';
import { format } from 'date-fns';

class Dom {
  constructor() {
    this.app = new TodoApp();
    this.currentEditTodoId = null;
    this.init();
  }

  init() {
    document.getElementById('add-project').addEventListener('click', () => this.showProjectDialog());
    document.getElementById('show-form-btn').addEventListener('click', () => this.showTodoDialog());
    document.getElementById('confirm-project-btn').addEventListener('click', () => this.handleProjectSubmit());
    document.getElementById('confirm-todo-btn').addEventListener('click', (event) => this.handleTodoFormSubmit(event));
    document.getElementById('cancel-project-btn').addEventListener('click', () => this.closeProjectDialog());
    document.getElementById('cancel-todo-btn').addEventListener('click', () => this.closeTodoDialog());
    this.render();
  }

  showProjectDialog() {
    const dialog = document.getElementById('project-dialog');
    dialog.showModal();
  }

  closeProjectDialog() {
    const dialog = document.getElementById('project-dialog');
    dialog.close();
  }

  handleProjectSubmit() {
    const projectName = document.getElementById('project-name').value.trim();
    if (projectName) {
      this.app.addProject(projectName);
      this.render();
      this.closeProjectDialog();
    } else {
      alert('Please enter a project name.');
    }
  }

  showTodoDialog() {
    const dialog = document.getElementById('todo-dialog');
    dialog.showModal();
  }

  closeTodoDialog() {
    const dialog = document.getElementById('todo-dialog');
    dialog.close();
  }

  handleTodoFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();
    const dueDate = document.getElementById('todo-dueDate').value;
    const priority = document.getElementById('todo-priority').value;

    if (title && description && dueDate) {
      if (this.currentEditTodoId !== null) {
        const todo = this.app.getTodoById(this.currentEditTodoId);
        if (todo) {
          this.app.editTodo(this.currentEditTodoId, title, description, dueDate, priority);
          this.currentEditTodoId = null;
        }
      } else {
        const tagName = this.app.currentProject ? this.app.currentProject.name : 'Default';
        this.app.addTodo(title, description, dueDate, priority, tagName);
      }

      this.render();
      this.clearForm();
      this.closeTodoDialog();
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
      const oldProjectName = projectName;
      const todosToUpdate = this.app.editProject(projectName, newProjectName);
  
      if (todosToUpdate && todosToUpdate.length > 0) {
        // Update tagName for todos associated with the project
        todosToUpdate.forEach(todo => {
          todo.tagName = newProjectName;
        });
      }
  
      this.render();
    }
  }
  
  

  deleteProject(projectName) {
    const confirmDelete = confirm('Are you sure you want to delete this project and all its todos?');
    if (confirmDelete) {
      this.app.deleteProject(projectName);
      this.render();
    }
  }

  editTodo(todoId) {
    const todo = this.app.getTodoById(todoId);
    if (todo) {
      document.getElementById('todo-title').value = todo.title;
      document.getElementById('todo-description').value = todo.description;
      document.getElementById('todo-dueDate').value = format(new Date(todo.dueDate), 'yyyy-MM-dd');
      document.getElementById('todo-priority').value = todo.priority;

      this.currentEditTodoId = todoId;
      this.showTodoDialog();
    }
  }

  deleteTodo(todoId) {
    const confirmDelete = confirm('Are you sure you want to delete this todo?');
    if (confirmDelete) {
      this.app.deleteTodo(todoId);
      this.render();
    }
  }

  toggleTodoComplete(todoId) {
    this.app.toggleTodoComplete(todoId);
    this.render();
  }

  render() {
    this.renderProjectList();
    this.renderTodoList();
  }

  renderProjectList() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    this.app.projects.forEach((project) => {
      const projectItem = document.createElement('li');
      projectItem.textContent = project.name;
      projectItem.classList.add('project-item');
      if (this.app.currentProject && this.app.currentProject.name === project.name) {
        projectItem.classList.add('active');
      }

      projectItem.addEventListener('click', () => {
        this.app.setCurrentProject(project.name);
        this.render();
      });

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.classList.add('edit-btn');
      editBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        this.editProject(project.name);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        this.deleteProject(project.name);
      });

      projectItem.appendChild(editBtn);
      projectItem.appendChild(deleteBtn);

      projectList.appendChild(projectItem);
    });
  }

  renderTodoList() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    if (this.app.currentProject && this.app.currentProject.name === 'Default') {
      // Render todos from all projects for the default project
      this.app.projects.forEach((project) => {
        project.todos.forEach((todo) => {
          const todoItem = this.createTodoElement(todo);
          todoList.appendChild(todoItem);
        });
      });
    } else {
      // Render todos from the current project only for other projects
      const todos = this.app.currentProject ? this.app.currentProject.todos : [];
      todos.forEach((todo) => {
        const todoItem = this.createTodoElement(todo);
        todoList.appendChild(todoItem);
      });
    }
  }

  createTodoElement(todo) {
    const todoItem = document.createElement('li');
    todoItem.textContent = todo.title;
    todoItem.classList.add('todo-item');
    if (todo.completed) {
      todoItem.classList.add('completed');
    }

    if (todo.priority === 'High') {
      todoItem.classList.add('priority-high');
    } else if (todo.priority === 'Medium') {
      todoItem.classList.add('priority-medium');
    } else {
      todoItem.classList.add('priority-low');
    }

    todoItem.addEventListener('click', () => this.toggleTodoComplete(todo.id));

    const todoDetails = document.createElement('div');
    todoDetails.classList.add('todo-details');
    todoDetails.innerHTML = `
      <p class="todo-title">${todo.title}</p>
      <p>${todo.description}</p>
      <p>Due: ${format(new Date(todo.dueDate), 'MM/dd/yyyy')}</p>
      <p class="tag">${todo.tagName}</p>
    `;

    todoItem.appendChild(todoDetails);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      this.editTodo(todo.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      this.deleteTodo(todo.id);
    });

    todoItem.appendChild(editBtn);
    todoItem.appendChild(deleteBtn);

    return todoItem;
  }
}

export default Dom;
