  class TodoApp {
    constructor() {
      this.projects = [];
      this.currentProject = null;
      this.loadDefaultProject();
    }

    loadDefaultProject() {
      const defaultProject = { name: 'Default', todos: [] };
      this.projects.push(defaultProject);
      this.currentProject = defaultProject;
    }

    addProject(name) {
      const project = { name, todos: [] };
      this.projects.push(project);
      this.currentProject = project;
    }

    setCurrentProject(name) {
      this.currentProject = this.projects.find(project => project.name === name);
    }

    editProject(oldName, newName) {
      const projectIndex = this.projects.findIndex(project => project.name === oldName);
      if (projectIndex !== -1) {
        const project = this.projects[projectIndex];
        project.name = newName;
        this.projects[projectIndex] = project;
    
        // Return todos associated with the project
        return project.todos;
      }
      return []; // Return an empty array if project not found
    }
    
    

    deleteProject(name) {
      this.projects = this.projects.filter(project => project.name !== name);
      if (this.currentProject.name === name) {
        this.currentProject = this.projects.length ? this.projects[0] : null;
      }
    }

    addTodo(title, description, dueDate, priority, tagName) {
      const todo = { id: Date.now(), title, description, dueDate, priority, tagName, completed: false };
      this.currentProject.todos.push(todo);
    }

    editTodo(id, title, description, dueDate, priority) {
      const todo = this.getTodoById(id);
      if (todo) {
        todo.title = title;
        todo.description = description;
        todo.dueDate = dueDate;
        todo.priority = priority;
      }
    }

    deleteTodo(id) {
      this.currentProject.todos = this.currentProject.todos.filter(todo => todo.id !== id);
    }

    toggleTodoComplete(id) {
      const todo = this.getTodoById(id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    }

    getTodoById(id) {
      return this.currentProject.todos.find(todo => todo.id === id);
    }

    getAllTodos() {
      return this.projects.reduce((allTodos, project) => {
        return allTodos.concat(project.todos);
      }, []);
    }
  }

  export default TodoApp;
