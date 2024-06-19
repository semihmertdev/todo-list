class Todo {
  constructor(title, description, dueDate, priority, notes, checklist = []) {
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.creationDate = new Date();
    this.lastUpdated = new Date();
    this.isComplete = false;
  }

  toggleComplete() {
    this.isComplete = !this.isComplete;
    this.lastUpdated = new Date();
  }

  updateDetails({ title, description, dueDate, priority, notes }) {
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.notes = notes;
    this.lastUpdated = new Date();
  }

  getFormattedDueDate() {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return this.dueDate.toLocaleDateString('en-US', options);
  }
}

export default Todo;