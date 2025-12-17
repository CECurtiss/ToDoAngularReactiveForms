import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = 'http://localhost:5000/items';
  constructor(private http: HttpClient) {}
    
  
  //  get items from backend
  getItems(): Observable<Item[]> {   
    return this.http.get<Item[]>(this.apiUrl);
  }

  // get items by Id
  getItemById(id: number): Observable<Item> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Getting item with id:', id);
    return this.http.get<Item>(url);
  }

  // add item to backend
  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }  
  
  // delete item from backend
  deleteItemById(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Deleting item with id:', id);
  return this.http.delete<void>(url); 
  }

  // update item in backend
  updateItem(item: Item): Observable<Item> {
    const url = `${this.apiUrl}/${item.id}`;
    console.log('Updating item with id:', item.id, 'Data:', item);
    return this.http.put<Item>(url, item);
  }

    // update completed value in backend
  updateCompleted(item: Item): Observable<Item> {
    const url = `${this.apiUrl}/${item.id}/updateCompleted`;
    console.log('Updating item with id:', item.id, 'Data:', item);
    return this.http.put<Item>(url, item);
  }
        
}
