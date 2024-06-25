import TodoApp from './todoApp';
import { format } from 'date-fns';

class Dom {
  constructor() {
    this.app = new TodoApp();
    this.currentEditTodoId = null;
    this.currentEditProjectName = null;
    this.currentDeleteTodoId = null; // Add this line
    this.init();
  }

  init() {
    document.getElementById('add-project').addEventListener('click', () => this.showProjectDialog());
    document.getElementById('show-form-btn').addEventListener('click', () => this.showTodoDialog());
    document.getElementById('confirm-project-btn').addEventListener('click', () => this.handleProjectSubmit());
    document.getElementById('confirm-todo-btn').addEventListener('click', (event) => this.handleTodoFormSubmit(event));
    document.getElementById('cancel-project-btn').addEventListener('click', () => this.closeProjectDialog());
    document.getElementById('cancel-todo-btn').addEventListener('click', () => this.closeTodoDialog());

    // Edit Project Dialog
    document.getElementById('confirm-edit-project-btn').addEventListener('click', () => this.handleEditProjectSubmit());
    document.getElementById('cancel-edit-project-btn').addEventListener('click', () => this.closeEditProjectDialog());

    // Delete Project Dialog
    document.getElementById('confirm-delete-project-btn').addEventListener('click', () => this.handleDeleteProjectSubmit());
    document.getElementById('cancel-delete-project-btn').addEventListener('click', () => this.closeDeleteProjectDialog());

    // Delete Todo Dialog
    document.getElementById('confirm-delete-todo-btn').addEventListener('click', () => this.handleDeleteTodoSubmit());
    document.getElementById('cancel-delete-todo-btn').addEventListener('click', () => this.closeDeleteTodoDialog());

    // Close Error Dialog
    document.getElementById('close-error-btn').addEventListener('click', () => this.closeErrorDialog());

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
      if (this.app.projects.some(project => project.name === projectName)) {
        this.showErrorDialog('A project with this name already exists.');
      } else {
        this.app.addProject(projectName);
        this.render();
        this.closeProjectDialog();
      }
    } else {
      this.showErrorDialog('Please enter a project name.');
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
      this.showErrorDialog('Please fill out all fields.');
    }
  }

  clearForm() {
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-description').value = '';
    document.getElementById('todo-dueDate').value = '';
    document.getElementById('todo-priority').value = 'Low';
    this.currentEditTodoId = null;
  }

  showEditProjectDialog(projectName) {
    const dialog = document.getElementById('edit-project-dialog');
    document.getElementById('edit-project-name').value = projectName;
    this.currentEditProjectName = projectName;
    dialog.showModal();
  }

  closeEditProjectDialog() {
    const dialog = document.getElementById('edit-project-dialog');
    dialog.close();
  }

  handleEditProjectSubmit() {
    const newProjectName = document.getElementById('edit-project-name').value.trim();
    if (newProjectName && this.currentEditProjectName) {
      if (this.app.projects.some(project => project.name === newProjectName && project.name !== this.currentEditProjectName)) {
        this.showErrorDialog('A project with this name already exists.');
      } else {
        const todosToUpdate = this.app.editProject(this.currentEditProjectName, newProjectName);

        if (todosToUpdate && todosToUpdate.length > 0) {
          // Update tagName for todos associated with the project
          todosToUpdate.forEach(todo => {
            todo.tagName = newProjectName;
          });
        }

        this.render();
        this.currentEditProjectName = null;
        this.closeEditProjectDialog();
      }
    } else {
      this.showErrorDialog('Please enter a new project name.');
    }
  }

  showDeleteProjectDialog(projectName) {
    const dialog = document.getElementById('delete-project-dialog');
    this.currentEditProjectName = projectName;
    dialog.showModal();
  }

  closeDeleteProjectDialog() {
    const dialog = document.getElementById('delete-project-dialog');
    dialog.close();
  }

  handleDeleteProjectSubmit() {
    if (this.currentEditProjectName) {
      this.app.deleteProject(this.currentEditProjectName);
      this.render();
      this.currentEditProjectName = null;
      this.closeDeleteProjectDialog();
    }
  }

  showErrorDialog(message) {
    const dialog = document.getElementById('error-dialog');
    document.getElementById('error-message').textContent = message;
    dialog.showModal();
  }

  closeErrorDialog() {
    const dialog = document.getElementById('error-dialog');
    dialog.close();
  }

  showDeleteTodoDialog(todoId) {
    const dialog = document.getElementById('delete-todo-dialog');
    this.currentDeleteTodoId = todoId;
    dialog.showModal();
  }

  closeDeleteTodoDialog() {
    const dialog = document.getElementById('delete-todo-dialog');
    dialog.close();
  }

  handleDeleteTodoSubmit() {
    if (this.currentDeleteTodoId !== null) {
      this.app.deleteTodo(this.currentDeleteTodoId);
      this.render();
      this.currentDeleteTodoId = null;
      this.closeDeleteTodoDialog();
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
    this.showDeleteTodoDialog(todoId);
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

      if (project.name !== 'Default') {
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          this.showEditProjectDialog(project.name);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          this.showDeleteProjectDialog(project.name);
        });

        projectItem.appendChild(editBtn);
        projectItem.appendChild(deleteBtn);
      }

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
    todoItem.classList.add('todo-item');
    if (todo.completed) {
      todoItem.classList.add('completed');
    }

    const title = document.createElement('span');
    title.textContent = `${todo.title} (Priority: ${todo.priority})`;
    todoItem.appendChild(title);

    const dueDate = document.createElement('span');
    dueDate.textContent = `Due: ${format(new Date(todo.dueDate), 'yyyy-MM-dd')}`;
    todoItem.appendChild(dueDate);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => this.editTodo(todo.id));
    todoItem.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
    todoItem.appendChild(deleteBtn);

    const completeBtn = document.createElement('button');
    completeBtn.textContent = todo.completed ? 'Unmark Complete' : 'Mark Complete';
    completeBtn.classList.add('complete-btn');
    completeBtn.addEventListener('click', () => this.toggleTodoComplete(todo.id));
    todoItem.appendChild(completeBtn);

    return todoItem;
  }
}

export default Dom;
