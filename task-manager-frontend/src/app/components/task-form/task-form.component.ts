import { Component, EventEmitter, Output } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { Task } from '../../interface/task.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<void>();
  newTask: Partial<Task> = {
    name: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: undefined
  };
  dateError: string = '';

  constructor(private taskService: TaskService) {}

  validateDueDate(): boolean {
    if (!this.newTask.dueDate) return true;
    
    const selectedDate = new Date(this.newTask.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.dateError = 'Due date must be in the future';
      return false;
    }
    
    this.dateError = '';
    return true;
  }
  onDateChange(): void {

    this.validateDueDate();

  }

  addTask(): void {
    if (!this.newTask.name?.trim()) {
      return;
    }

    if (!this.validateDueDate()) {
      return;
    }

    this.taskService.addTask(this.newTask).subscribe({
      next: () => {
        this.newTask = {
          name: '',
          description: '',
          completed: false,
          priority: 'medium',
          dueDate: undefined
        };
        this.dateError = '';
        this.taskAdded.emit();
      },
      error: (error) => {
        if (error.error.message.includes('Due date must be in the future')) {
          this.dateError = 'Due date must be in the future';
        }
      }
    });
  }
}