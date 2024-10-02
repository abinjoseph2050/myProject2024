import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { BookService } from '../book.service';
import { DialogRef } from '@angular/cdk/dialog';
import { AddTagComponent } from '../add-tag/add-tag.component';

export interface PeriodicElement {
  sl: number;
  title: string;
  author: string;
  year: number;
  tags: string[];
}

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent {
  bookData: PeriodicElement[] = this.bookService.wholeBooks;

  dataSource = new MatTableDataSource(this.bookData);
  constructor(public dialog: MatDialog, public bookService: BookService) {}

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    book: any
  ): void {
    const DialogRef = this.dialog.open(AddEditComponent, {
      width: '80vh',
      height: '70vh',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { book },
    });
    DialogRef.afterClosed().subscribe(() => {
      this.dataSource = new MatTableDataSource(this.bookData);
      // console.log(this.bookData);
    });
  }

  openEditTag(book: any) {
    const DialogRef = this.dialog.open(AddTagComponent, {
      width: '50vh',
      height: '40vh',
      data: { book },
    });
    DialogRef.afterClosed().subscribe(() => {
      this.dataSource = new MatTableDataSource(this.bookData);
      // console.log(this.bookData);
    });
  }

  displayedColumns: string[] = [
    'sl',
    'title',
    'author',
    'year',
    'tags',
    'actions',
  ];

  deleteBook(id: any) {
    // console.log(id, 'Bookid');
    this.bookData.splice(id - 1, 1);
    let newSl = 1;
    this.bookData.forEach((book: any) => {
      book.sl = newSl;
      newSl++;
    });
    this.dataSource = new MatTableDataSource(this.bookData);
  }
}
