export default class Todo {
    constructor(id, title, description, dueDate, priority, tagName, creationDate = new Date(), 
                completionStatus = false, category = '', subtasks = [], attachments = [], 
                comments = '', reminder = null, estimatedTime = null, recurring = null, assignedTo = '') {
      this.id = id;
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.tagName = tagName; // Added tagName property
      this.creationDate = creationDate;
      this.completionStatus = completionStatus;
      this.category = category;
      this.subtasks = subtasks;
      this.attachments = attachments;
      this.comments = comments;
      this.reminder = reminder;
      this.estimatedTime = estimatedTime;
      this.recurring = recurring;
      this.assignedTo = assignedTo;
    }
  }
  