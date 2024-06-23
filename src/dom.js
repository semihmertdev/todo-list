import TodoApp from './todoApp';

export default class Dom {
  constructor() {
    this.app = new TodoApp();
    this.init();
  }

  init() {
    document.getElementById('add-project').addEventListener('click', () => this.showProjectModal());
    document.getElementById('show-form-btn').addEventListener('click', () => this.showTodoModal());
    document.getElementById('todo-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.saveTodo();
    });
    document.getElementById('save-project').addEventListener('click', () => this.saveProject());
    document.getElementById('close-project-modal').addEventListener('click', () => this.hideProjectModal());
    document.getElementById('close-todo-modal').addEventListener('click', () => this.hideTodoModal());
    this.render();
  }

  showProjectModal(projectName = '') {
    document.getElementById('project-name').value = projectName;
    document.getElementById('project-modal-title').textContent = projectName ? 'Edit Project' : 'Add Project';
    document.getElementById('project-modal').style.display = 'block';
  }

  hideProjectModal() {
    document.getElementById('project-modal').style.display = 'none';
  }

  saveProject() {
    const projectName = document.getElementById('project-name').value.trim();
    if (projectName) {
      if (document.getElementById('project-modal-title').textContent === 'Edit Project') {
        this.app.editProject(this.app.currentProject.name, projectName);
      } else {
        this.app.addProject(projectName);
      }
      this.hideProjectModal();
      this.render();
    }
  }

  showTodoModal(todo = null) {
    if (todo) {
      document.getElementById('todo-title').value = todo.title;
      document.getElementById('todo-description').value = todo.description;
      document.getElementById('todo-dueDate').value = todo.dueDate;
      document.getElementById('todo-priority').value = todo.priority;
      document.getElementById('todo-modal-title').textContent = 'Edit Todo';
      document.getElementById('save-todo').setAttribute('data-id', todo.id);
    } else {
      document.getElementById('todo-title').value = '';
      document.getElementById('todo-description').value = '';
      document.getElementById('todo-dueDate').value = '';
      document.getElementById('todo-priority').value = 'Low';
      document.getElementById('todo-modal-title').textContent = 'Add Todo';
      document.getElementById('save-todo').removeAttribute('data-id');
    }
    document.getElementById('todo-modal').style.display = 'block';
  }

  hideTodoModal() {
    document.getElementById('todo-modal').style.display = 'none';
  }

  saveTodo() {
    const id = document.getElementById('save-todo').getAttribute('data-id');
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();
    const dueDate = document.getElementById('todo-dueDate').value;
    const priority = document.getElementById('todo-priority').value;
    if (title && description && dueDate) {
      if (id) {
        this.app.editTodo(parseInt(id, 10), title, description, dueDate, priority);
      } else {
        this.app.addTodo(title, description, dueDate, priority);
      }
      this.hideTodoModal();
      this.render();
    } else {
      alert('Please fill out all fields.');
    }
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
        li.classList.add('project-item');
        li.id = projectName.toLowerCase();
        li.addEventListener('click', () => {
          this.app.switchProject(projectName);
          this.render();
        });

        // Edit Button for Project
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showProjectModal(projectName);
        });
        li.appendChild(editButton);

        // Delete Button for Project
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.app.deleteProject(projectName);
          this.render();
        });
        li.appendChild(deleteButton);

        projectList.appendChild(li);
      }
    });
  }

  renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    const todos = this.app.getCurrentProjectTodos();
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = `${todo.title} - ${todo.description} - ${todo.dueDate} - ${todo.priority} (${todo.projectName})`;

      // Edit Button for Todo
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-btn');
      editButton.addEventListener('click', () => {
        this.showTodoModal(todo);
      });
      li.appendChild(editButton);

      // Delete Button for Todo
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => {
        this.app.deleteTodo(todo.id);
        this.render();
      });
      li.appendChild(deleteButton);

      todoList.appendChild(li);
    });
  }
}
