import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '../../services/item';
import { Item } from '../../models/item.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-task',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-task.html',
  styleUrl: './update-task.css',
})
export class UpdateTask implements OnInit {

  item: Item | null = null;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

    today: string = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Retrieved Id", id);
    this.retreiveItemById(id);
  }

  // get Item by Id
  retreiveItemById(id: number): void {
    this.itemService.getItemById(id).subscribe({
      next: (data) => {
        this.item = data;
        console.log("Item loaded:", this.item);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching item by id:", err);
      }
    });
  }

  // update Item
  updateItem(): void {
    if(window.confirm("Are you sure you want to update this task?")) {
    console.log("Updating item:", this.item);
    if (this.item) {
      this.itemService.updateItem(this.item).subscribe({
        next: (data) => {
          console.log("Item updated successfully:", data);
          this.cdr.detectChanges();
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