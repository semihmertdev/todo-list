import TodoApp from './todoApp';

class DOM {
  constructor() {
    this.todoApp = new TodoApp();
    this.projectContainer = document.getElementById('project-container');
    this.todoContainer = document.getElementById('todo-app');
    this.modal = document.getElementById('modal');
    this.modalContent = document.getElementById('modal-content');
    this.render();
  }

  render() {
    this.todoContainer.innerHTML = '';
    this.projectContainer.innerHTML = '';

    // Render project list
    const projectList = document.createElement('ul');
    this.todoApp.projects.forEach((project, index) => {
      const projectItem = document.createElement('li');
      projectItem.textContent = project.name;
      projectItem.className = index === this.todoApp.currentProjectIndex ? 'active' : '';
      projectItem.onclick = () => {
        this.todoApp.setCurrentProject(index);
        this.render();
      };
      projectList.appendChild(projectItem);
    });
    this.projectContainer.appendChild(projectList);

    // Render todos of the current project
    const currentProjectTodos = this.todoApp.projects[this.todoApp.currentProjectIndex].todos;
    const todoList = document.createElement('div');
    currentProjectTodos.forEach((todo, index) => {
      const todoItem = document.createElement('div');
      todoItem.className = `todo-item priority-${todo.priority.toLowerCase()} ${todo.isComplete ? 'complete' : ''}`;

      const todoTitle = document.createElement('span');
      todoTitle.textContent = `${todo.title} (Due: ${todo.getFormattedDueDate()})`;
      todoTitle.className = 'title';
      if (todo.isComplete) {
        todoTitle.style.textDecoration = 'line-through';
      }

      const detailsButton = document.createElement('button');
      detailsButton.textContent = 'Details';
      detailsButton.onclick = () => {
        this.showTodoDetails(todo, index);
      };

      const toggleCompleteButton = document.createElement('button');
      toggleCompleteButton.textContent = todo.isComplete ? 'Undo' : 'Complete';
      toggleCompleteButton.onclick = () => {
        todo.toggleComplete();
        this.todoApp.saveToLocalStorage();
        this.render();
      };

      todoItem.appendChild(todoTitle);

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions';
      actionsDiv.appendChild(detailsButton);
      actionsDiv.appendChild(toggleCompleteButton);

      todoItem.appendChild(actionsDiv);

      todoList.appendChild(todoItem);
    });

    this.todoContainer.appendChild(todoList);

    // Add Project Form
    this.renderAddProjectForm();

    // Add Todo Form
    this.renderAddTodoForm();

    //delete project
    
  }

  renderAddProjectForm() {
    const addProjectButton = document.createElement('button');
    addProjectButton.textContent = 'Add Project';
    addProjectButton.onclick = () => {
      this.openModal('Add Project', this.renderAddProjectFormModal());
    };

    this.projectContainer.appendChild(addProjectButton);
  }

  renderAddProjectFormModal() {
    const modalContent = document.createElement('div');

    const projectNameInput = document.createElement('input');
    projectNameInput.type = 'text';
    projectNameInput.placeholder = 'Project Name';
    projectNameInput.required = true;

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Project';
    addButton.onclick = () => {
      this.todoApp.addProject(projectNameInput.value);
      this.todoApp.saveToLocalStorage();
      this.render();
      this.closeModal();
    };

    modalContent.appendChild(projectNameInput);
    modalContent.appendChild(addButton);

    return modalContent;
  }

  renderAddTodoForm() {
    const addTodoButton = document.createElement('button');
    addTodoButton.textContent = 'Add Todo';
    addTodoButton.onclick = () => {
      this.openModal('Add Todo', this.renderAddTodoFormModal());
    };

    this.todoContainer.appendChild(addTodoButton);
  }

  renderAddTodoFormModal() {
    const modalContent = document.createElement('div');

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Title';
    titleInput.required = true;

    const descriptionInput = document.createElement('textarea');
    descriptionInput.placeholder = 'Description';

    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.required = true;

    const prioritySelect = document.createElement('select');
    ['Low', 'Medium', 'High'].forEach(priority => {
      const option = document.createElement('option');
      option.value = priority;
      option.textContent = priority;
      prioritySelect.appendChild(option);
    });

    const notesInput = document.createElement('textarea');
    notesInput.placeholder = 'Notes';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Todo';
    addButton.type = 'submit';
    addButton.onclick = () => {
      this.todoApp.addTodoToCurrentProject(
        titleInput.value,
        descriptionInput.value,
        dueDateInput.value,
        prioritySelect.value,
        notesInput.value
      );
      this.todoApp.saveToLocalStorage();
      this.render();
      this.closeModal();
    };

    modalContent.appendChild(titleInput);
    modalContent.appendChild(descriptionInput);
    modalContent.appendChild(dueDateInput);
    modalContent.appendChild(prioritySelect);
    modalContent.appendChild(notesInput);
    modalContent.appendChild(addButton);
    
    return modalContent;
  }

  showTodoDetails(todo, index) {
    const modalContent = document.createElement('div');

    const titleLabel = document.createElement('h2');
    titleLabel.textContent = 'Todo Details';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = todo.title;
    titleInput.required = true;

    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Description:';
    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.value = todo.description;

    const dueDateLabel = document.createElement('label');
    dueDateLabel.textContent = 'Due Date:';
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.valueAsDate = todo.dueDate;
    dueDateInput.required = true;

    const priorityLabel = document.createElement('label');
    priorityLabel.textContent = 'Priority:';
    const prioritySelect = document.createElement('select');
    ['Low', 'Medium', 'High'].forEach(priority => {
      const option = document.createElement('option');
      option.value = priority;
      option.textContent = priority;
      if (todo.priority.toLowerCase() === priority.toLowerCase()) {
        option.selected = true;
      }
      prioritySelect.appendChild(option);
    });

    const notesLabel = document.createElement('label');
    notesLabel.textContent = 'Notes:';
    const notesTextarea = document.createElement('textarea');
    notesTextarea.value = todo.notes;

    const checklistLabel = document.createElement('label');
    checklistLabel.textContent = 'Checklist:';
    const checklistTextarea = document.createElement('textarea');
    checklistTextarea.placeholder = 'Enter items separated by commas';
    checklistTextarea.value = todo.checklist.join(', ');

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => {
      todo.updateDetails({
        title: titleInput.value,
        description: descriptionTextarea.value,
        dueDate: dueDateInput.value,
        priority: prioritySelect.value,
        notes: notesTextarea.value,
      });
      if (checklistTextarea.value.trim() !== '') {
        todo.checklist = checklistTextarea.value.split(',').map(item => item.trim());
      } else {
        todo.checklist = [];
      }
      this.todoApp.saveToLocalStorage();
      this.render();
      this.closeModal();
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
      this.todoApp.deleteTodoFromCurrentProject(index);
      this.todoApp.saveToLocalStorage();
      this.render();
      this.closeModal();
    };

    modalContent.appendChild(titleLabel);
    modalContent.appendChild(titleInput);
    modalContent.appendChild(descriptionLabel);
    modalContent.appendChild(descriptionTextarea);
    modalContent.appendChild(dueDateLabel);
    modalContent.appendChild(dueDateInput);
    modalContent.appendChild(priorityLabel);
    modalContent.appendChild(prioritySelect);
    modalContent.appendChild(notesLabel);
    modalContent.appendChild(notesTextarea);
    modalContent.appendChild(checklistLabel);
    modalContent.appendChild(checklistTextarea);
    modalContent.appendChild(saveButton);
    modalContent.appendChild(deleteButton);

    this.openModal('Todo Details', modalContent);
  }

  openModal(title, content) {
    this.modal.style.display = 'block';
    this.modalContent.innerHTML = '';
    
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;
    this.modalContent.appendChild(modalTitle);

    this.modalContent.appendChild(content);
  }

  closeModal() {
    this.modal.style.display = 'none';
  }
}

export default DOM;
