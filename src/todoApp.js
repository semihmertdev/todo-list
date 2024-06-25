class TodoApp {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.loadProjects();
  }

  loadProjects() {
    const savedProjects = JSON.parse(localStorage.getItem('projects'));
    if (savedProjects && savedProjects.length > 0) {
      this.projects = savedProjects;
      this.currentProject = this.projects[0];
    } else {
      this.initDefaultProject();
    }
  }

  saveProjects() {
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  initDefaultProject() {
    const defaultProject = this.addProject('Default');
    this.setCurrentProject(defaultProject.name);
  }

  addProject(name) {
    const project = {
      name,
      todos: []
    };
    this.projects.push(project);
    this.saveProjects();
    return project;
  }

  editProject(oldName, newName) {
    if (oldName === 'Default') {
      alert('The Default project cannot be edited.');
      return;
    }
    const project = this.projects.find(proj => proj.name === oldName);
    if (project) {
      project.name = newName;
      this.saveProjects();
      return project.todos;
    }
    return [];
  }

  deleteProject(name) {
    if (name === 'Default') {
      alert('The Default project cannot be deleted.');
      return;
    }
    this.projects = this.projects.filter(proj => proj.name !== name);
    if (this.currentProject.name === name) {
      this.currentProject = this.projects[0] || null;
    }
    this.saveProjects();
  }

  setCurrentProject(name) {
    this.currentProject = this.projects.find(proj => proj.name === name) || null;
  }

  addTodo(title, description, dueDate, priority, tagName) {
    const project = this.projects.find(proj => proj.name === tagName);
    if (project) {
      const todo = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        completed: false,
        tagName
      };
      project.todos.push(todo);
      this.saveProjects();
    }
  }

  editTodo(id, title, description, dueDate, priority) {
    this.projects.forEach(project => {
      const todo = project.todos.find(todo => todo.id === id);
      if (todo) {
        todo.title = title;
        todo.description = description;
        todo.dueDate = dueDate;
        todo.priority = priority;
        this.saveProjects();
      }
    });
  }

  deleteTodo(id) {
    this.projects.forEach(project => {
      project.todos = project.todos.filter(todo => todo.id !== id);
    });
    this.saveProjects();
  }

  toggleTodoComplete(id) {
    this.projects.forEach(project => {
      const todo = project.todos.find(todo => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.saveProjects();
      }
    });
  }

  getTodoById(id) {
    for (const project of this.projects) {
      const todo = project.todos.find(todo => todo.id === id);
      if (todo) {
        return todo;
      }
    }
    return null;
  }

  getAllTodos() {
    return this.projects.reduce((allTodos, project) => {
      return allTodos.concat(project.todos);
    }, []);
  }
}

export default TodoApp;
