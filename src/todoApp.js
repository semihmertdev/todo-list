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
    if (this.projects[oldName]) {
      const project = this.projects[oldName];
      delete this.projects[oldName];
      project.name = newName;
      this.projects[newName] = project;
      if (this.currentProject === project) {
        this.currentProject = project;
      }
    }
  }

  deleteProject(name) {
    if (this.projects[name]) {
      delete this.projects[name];
      if (this.currentProject && this.currentProject.name === name) {
        this.currentProject = null;
      }
    }
  }

  addTodo(title, description, dueDate, priority, tagName) {
    if (!this.currentProject) return;
    if (title && description && dueDate && priority) {
      const todo = new Todo(
        this.todoIdCounter++, 
        title, 
        description, 
        dueDate, 
        priority,
        tagName // Pass tagName to Todo constructor
      );
      if (this.currentProject.name !== 'Default') {
        this.currentProject.addTodo(todo);
      }
      this.projects['Default'].addTodo(todo); // Always add to Default
    }
  }

  editTodo(todoId, title, description, dueDate, priority) {
    if (!this.currentProject) return;
    const todo = this.getTodoById(todoId);
    if (todo) {
      todo.title = title;
      todo.description = description;
      todo.dueDate = dueDate;
      todo.priority = priority;
    }
  }

  deleteTodo(todoId) {
    if (!this.currentProject) return;
    this.currentProject.deleteTodo(todoId);
  }

  toggleComplete(todoId) {
    if (!this.currentProject) return;
    this.currentProject.toggleComplete(todoId);
  }

  getCurrentProjectTodos() {
    return this.currentProject ? this.currentProject.todos : [];
  }

  getProjects() {
    return Object.keys(this.projects);
  }

  getTodoById(todoId) {
    if (!this.currentProject) return null;
    return this.currentProject.todos.find(todo => todo.id === todoId);
  }
}
