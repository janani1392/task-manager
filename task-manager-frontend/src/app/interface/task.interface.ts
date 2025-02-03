export interface Task {
    _id: string;
    name: string;
    description?: string;
    completed: boolean;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
  }