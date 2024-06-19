class Todo {
  constructor(title, description, dueDate, priority, notes = '', checklist = []) {
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.isComplete = false;
    this.creationDate = new Date();
    this.lastUpdated = new Date();
  }

  getFormattedDueDate() {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return this.dueDate.toLocaleDateString('en-US', options);
  }

  toggleComplete() {
    this.isComplete = !this.isComplete;
    this.lastUpdated = new Date();
  }

  updateDetails({ title, description, dueDate, priority, notes }) {
    if (title !== undefined) this.title = title;
    if (description !== undefined) this.description = description;
    if (dueDate !== undefined) this.dueDate = new Date(dueDate);
    if (priority !== undefined) this.priority = priority;
    if (notes !== undefined) this.notes = notes;
    this.lastUpdated = new Date();
  }
}

export default Todo;
