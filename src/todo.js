export default class Todo {
  constructor(id, title, description, dueDate, priority, projectName) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completionStatus = false;
    this.projectName = projectName; // Add projectName field
  }
}
