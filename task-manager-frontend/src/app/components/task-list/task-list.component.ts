import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../interface/task.interface';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task._id).subscribe(() => {
      this.loadTasks();
    });
  }

  startEdit(task: Task): void {
    this.editingTask = { ...task };
  }

  saveTask(): void {
    if (!this.editingTask) return;
    this.taskService.updateTask(this.editingTask._id, this.editingTask).subscribe(() => {
      this.editingTask = null;
      this.loadTasks();
    });
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  // Add this new method
  toggleComplete(task: Task): void {
    const updatedTask = {
      ...task,
      completed: !task.completed
    };
    
    this.taskService.updateTask(task._id, updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }
}