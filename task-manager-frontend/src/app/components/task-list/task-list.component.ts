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
  filteredTasks: Task[] = [];
  editingTask: Task | null = null;
  
  // Filter and sort options
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  sortBy: 'dueDate' | 'priority' | 'name' = 'dueDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchQuery: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
      this.applyFiltersAndSort();
    });
  }

  applyFiltersAndSort(): void {
    // First apply filters
    this.filteredTasks = this.tasks.filter(task => {
      // Apply status filter
      if (this.filterStatus === 'active' && task.completed) return false;
      if (this.filterStatus === 'completed' && !task.completed) return false;

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return task.name.toLowerCase().includes(query) || 
               (task.description?.toLowerCase().includes(query) || false);
      }

      return true;
    });

    // Then sort
    this.filteredTasks.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'dueDate':
          comparison = this.compareDates(a.dueDate, b.dueDate);
          break;
        case 'priority':
          comparison = this.comparePriority(a.priority, b.priority);
          break;
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  private compareDates(dateA?: Date, dateB?: Date): number {
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  }

  private comparePriority(priorityA?: string, priorityB?: string): number {
    const priorityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
    const weightA = priorityWeight[priorityA as keyof typeof priorityWeight] || 0;
    const weightB = priorityWeight[priorityB as keyof typeof priorityWeight] || 0;
    return weightB - weightA;
  }

  // Filter changes
  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  // Sort changes
  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  // Search changes
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFiltersAndSort();
  }

  // Existing methods remain the same
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

  toggleComplete(task: Task): void {
    const updatedTask = {
      ...task,
      completed: !task.completed
    };
    
    this.taskService.updateTask(task._id, updatedTask).subscribe({
      next: () => {
        const index = this.tasks.findIndex(t => t._id === task._id);
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], completed: !task.completed };
          this.applyFiltersAndSort();
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
        const checkbox = document.querySelector(`input[type="checkbox"][data-task-id="${task._id}"]`) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = task.completed;
        }
      }
    });
  }
}