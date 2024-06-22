import Project from './project';
import Todo from './todo';
import { format } from 'date-fns';

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
      const formattedDueDate = format(new Date(dueDate), 'yyyy-MM-dd');
      const todo = new Todo(
        this.todoIdCounter++, 
        title, 
        description, 
        formattedDueDate, 
        priority,
        tagName // Pass tagName to Todo constructor
      );
      if (this.currentProject.name !== 'Default') {
        this.currentProject.addTodo(todo);
      }
      this.projects['Default'].addTodo(todo); // Always add to Default
    }
  }

  editTodo(id, title, description, dueDate, priority) {
    const formattedDueDate = format(new Date(dueDate), 'yyyy-MM-dd');
    Object.values(this.projects).forEach(project => {
      const todo = project.todos.find(todo => todo.id === id);
      if (todo) {
        todo.title = title;
        todo.description = description;
        todo.dueDate = formattedDueDate;
        todo.priority = priority;
      }
    });
  }

  deleteTodo(id) {
    Object.values(this.projects).forEach(project => {
      const index = project.todos.findIndex(todo => todo.id === id);
      if (index !== -1) {
        project.todos.splice(index, 1);
      }
    });
  }

  toggleComplete(id) {
    Object.values(this.projects).forEach(project => {
      const todo = project.todos.find(todo => todo.id === id);
      if (todo) {
        todo.completionStatus = !todo.completionStatus;
      }
    });
  }

  getCurrentProjectTodos() {
    return this.currentProject ? this.currentProject.todos : [];
  }

  getProjects() {
    return Object.keys(this.projects);
  }

  getTodoById(id) {
    for (const project of Object.values(this.projects)) {
      const todo = project.todos.find(todo => todo.id === id);
      if (todo) return todo;
    }
    return null;
  }
}
