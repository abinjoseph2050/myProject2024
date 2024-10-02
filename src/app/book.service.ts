import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  public wholeBooks = [
    {
      sl: 1,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      year: 2006,
      tags: ['Story', 'Fantasy'],
    },
  ];

  saveDb() {
    this.http.post('http://localhost:3000/data', this.wholeBooks).pipe(
      map((res: any) => {
        console.log(res, 'response');
      })
    );
  }
}
