import Project from './project';
import Todo from './todo';

class TodoApp {
  constructor() {
    this.loadFromLocalStorage(); // Load data from localStorage on app initialization
    if (this.projects.length === 0) {
      this.projects = [new Project('Default Project')];
      this.saveToLocalStorage(); // Save default project to localStorage if none exists
    }
    this.currentProjectIndex = 0;
  }

  // Method to save projects to localStorage
  saveToLocalStorage() {
    localStorage.setItem('todoAppProjects', JSON.stringify(this.projects));
    localStorage.setItem('todoAppCurrentProjectIndex', this.currentProjectIndex);
  }

  // Method to load projects from localStorage
  loadFromLocalStorage() {
    const storedProjects = localStorage.getItem('todoAppProjects');
    if (storedProjects) {
      try {
        this.projects = JSON.parse(storedProjects).map(project => {
          const newProject = new Project(project.name);
          newProject.todos = project.todos.map(todo => {
            const newTodo = new Todo(
              todo.title,
              todo.description,
              todo.dueDate,
              todo.priority,
              todo.notes,
              todo.checklist
            );
            Object.assign(newTodo, todo); // Copy all properties from stored todo
            newTodo.dueDate = new Date(todo.dueDate); // Restore dueDate as Date object
            newTodo.creationDate = new Date(todo.creationDate); // Restore creationDate as Date object
            newTodo.lastUpdated = new Date(todo.lastUpdated); // Restore lastUpdated as Date object
            return newTodo;
          });
          return newProject;
        });
      } catch (error) {
        console.error('Error parsing projects from localStorage:', error);
        this.projects = [];
      }
    } else {
      this.projects = [];
    }

    const storedCurrentProjectIndex = localStorage.getItem('todoAppCurrentProjectIndex');
    if (storedCurrentProjectIndex !== null) {
      this.currentProjectIndex = parseInt(storedCurrentProjectIndex, 10);
    } else {
      this.currentProjectIndex = 0;
    }
  }

  // Method to add a new project
  addProject(name) {
    const newProject = new Project(name);
    this.projects.push(newProject);
    this.saveToLocalStorage(); // Save projects after adding a new project
  }

  // Method to set the current project index
  setCurrentProject(index) {
    this.currentProjectIndex = index;
    this.saveToLocalStorage(); // Save current project index
  }

  // Method to add a new todo to the current project
  addTodoToCurrentProject(title, description, dueDate, priority, notes) {
    const todo = new Todo(title, description, dueDate, priority, notes);
    this.projects[this.currentProjectIndex].addTodo(todo);
    this.saveToLocalStorage(); // Save projects after adding a new todo
  }

  // Method to delete a todo from the current project
  deleteTodoFromCurrentProject(index) {
    this.projects[this.currentProjectIndex].deleteTodo(index);
    this.saveToLocalStorage(); // Save projects after deleting a todo
  }
}

export default TodoApp;
