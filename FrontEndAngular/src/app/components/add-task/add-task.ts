import { Component } from '@angular/core';
import { ItemService } from '../../services/item';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {
  constructor(private itemService: ItemService,
    private router: Router
  ) {};

  userForm: FormGroup= new FormGroup({
    task: new FormControl(''),
    priority: new FormControl(''),
    dueDate: new FormControl(''),
    completed: new FormControl(false),
    dateCompleted: new FormControl(undefined)
  });

  today: string = new Date().toISOString().split('T')[0];
  

  addTask(): void {
    console.log(this.userForm.value);
    this.itemService.addItem(this.userForm.value).subscribe({
      next: (addedItem) => {
        console.log('Item added successfully:', addedItem);
        this.router.navigate(['/to-do-list']);
      },
      error: (err) => console.error(err)
    })
  };
  
  
};
