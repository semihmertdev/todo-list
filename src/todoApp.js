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

  toggleComplete(index) {
    if (!this.currentProject) return;
    this.currentProject.toggleComplete(index);
  }

  getCurrentProjectTodos() {
    return this.currentProject ? this.currentProject.todos : [];
  }

  getProjects() {
    return Object.keys(this.projects);
  }
}
