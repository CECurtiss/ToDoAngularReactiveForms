import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item';
import { Item } from '../../models/item.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-task',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-task.html',
  styleUrl: './update-task.css',
})
export class UpdateTask implements OnInit {
  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  id!: number;

  taskForm: FormGroup = new FormGroup({
      task: new FormControl(''),
      priority: new FormControl(''),
      dueDate: new FormControl(''),
      completed: new FormControl(false),
      dateCompleted: new FormControl(null)
        });

  today: string = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Retrieved Id", this.id);
    this.retreiveItemById(this.id);
  }

  // get Item by Id
  retreiveItemById(id: number): void {
    this.itemService.getItemById(id).subscribe({
      next: (item: Item) => {
        this.taskForm.patchValue({
          task: item.task,
          priority: item.priority,
          dueDate: item.dueDate,
          completed: item.completed,
          dateCompleted: item.dateCompleted
        });
        console.log("Item loaded:", item);
      },
      error: (err) => {
        console.error("Error fetching item by id:", err);
      }
    });
  }

  // update Item
  updateItem(): void {
    if(window.confirm("Are you sure you want to update this task?")) {
      this.taskForm.value.id = this.id;
    console.log("Updating item:", this.taskForm.value);
    if (this.taskForm.valid) {
      this.itemService.updateItem(this.taskForm.value).subscribe({
        next: (data) => {
          console.log("Item updated successfully:", data);
          this.router.navigate(['/to-do-list']);
        },
        error: (err) => {
          console.error("Error updating item:", err);
        }
      });
    }
  } else {
    console.log("Update cancelled by user.");
}
}
}