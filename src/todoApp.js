import Project from './project';
import Todo from './todo';

export default class TodoApp {
  constructor() {
    this.projects = {};
    this.currentProject = null;
    this.todoIdCounter = 1;
    this.createProject('Default');
    this.switchProject('Default');
  }

  createProject(name) {
    if (!this.projects[name]) {
      this.projects[name] = new Project(name);
    }
  }

  switchProject(name) {
    if (this.projects[name]) {
      this.currentProject = this.projects[name];
    }
  }

  addProject(name) {
    if (name && !this.projects[name]) {
      this.createProject(name);
      this.switchProject(name);
    }
  }

  editProject(oldName, newName) {
    if (this.projects[oldName] && !this.projects[newName]) {
      this.projects[oldName].name = newName;
      this.projects[newName] = this.projects[oldName];
      delete this.projects[oldName];
      this.updateTodoProjectName(oldName, newName);
      if (this.currentProject.name === oldName) {
        this.switchProject(newName);
      }
    }
  }

  updateTodoProjectName(oldName, newName) {
    for (const todo of this.projects[newName].todos) {
      todo.projectName = newName;
    }
  }

  deleteProject(name) {
    if (this.projects[name] && name !== 'Default') {
      delete this.projects[name];
      if (this.currentProject.name === name) {
        this.switchProject('Default');
      }
    }
  }

  addTodo(title, description, dueDate, priority) {
    if (!this.currentProject) return;
    if (title && description && dueDate && priority) {
      const todo = new Todo(
        this.todoIdCounter++,
        title,
        description,
        dueDate,
        priority,
        this.currentProject.name
      );
      this.currentProject.addTodo(todo);
    }
  }

  editTodo(id, title, description, dueDate, priority) {
    const todo = this.findTodoById(id);
    if (todo) {
      todo.title = title;
      todo.description = description;
      todo.dueDate = dueDate;
      todo.priority = priority;
    }
  }

  deleteTodo(id) {
    for (const projectName in this.projects) {
      this.projects[projectName].deleteTodo(id);
    }
  }

  toggleComplete(id) {
    for (const projectName in this.projects) {
      const todo = this.projects[projectName].todos.find(todo => todo.id === id);
      if (todo) {
        todo.completionStatus = !todo.completionStatus;
        break;
      }
    }
  }

  getCurrentProjectTodos() {
    if (this.currentProject && this.currentProject.name === 'Default') {
      return Object.values(this.projects).flatMap(project => project.todos);
    }
    return this.currentProject ? this.currentProject.todos : [];
  }

  getProjects() {
    return Object.keys(this.projects);
  }

  findTodoById(id) {
    for (const projectName in this.projects) {
      const todo = this.projects[projectName].todos.find(todo => todo.id === id);
      if (todo) return todo;
    }
    return null;
  }
}
