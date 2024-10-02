import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BookService } from '../book.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class AddEditComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { book: any },
    private bookService: BookService
  ) {}

  public currentBook: any;
  bookTagsControl = new FormControl();
  addOnBlur = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: any = [];
  isEdit = false;

  bookForm = new FormGroup({
    titleName: new FormControl(''),
    authorName: new FormControl(''),
    publishedYear: new FormControl(''),
    bookTags: this.bookTagsControl,
  });

  ngOnInit() {
    this.currentBook = this.data.book;
    if (this.currentBook != '') {
      this.isEdit = true;
      this.bookForm.controls['titleName'].setValue(this.currentBook.title);
      this.bookForm.controls['authorName'].setValue(this.currentBook.author);
      this.bookForm.controls['publishedYear'].setValue(this.currentBook.year);
      this.tags = [];
      this.currentBook.tags.forEach((tag: any) => {
        this.tags.push({ name: tag });
      });
      this.bookForm.controls['bookTags'].setValue(this.tags);
    } else {
      this.isEdit = false;
    }
    // console.log(this.currentBook, 'currentBook');
    // console.log(this.bookService.wholeBooks, 'wholeBooks');
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push({ name: value });
    }
    this.bookTagsControl.setValue(this.tags);
    event.chipInput!.clear();
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.bookTagsControl.setValue(this.tags);
  }

  edit(tag: any, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(tag);
      return;
    }

    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index].name = value;
    }
    this.bookTagsControl.setValue(this.tags);
  }

  onSubmit() {
    // console.log(this.bookForm.value);
    let newBook = this.bookForm.value;
    let newTags: any[] = [];
    newBook.bookTags.forEach((tag: any) => {
      newTags.push(tag.name);
    });
    let book: any = {
      title: newBook.titleName,
      author: newBook.authorName,
      year: newBook.publishedYear,
      tags: newTags,
    };
    if (!this.isEdit) {
      let slNo = this.bookService.wholeBooks.length;
      (book.sl = slNo + 1), this.bookService.wholeBooks.push(book);
      this.bookService.saveDb();
    } else {
      (book.sl = this.currentBook.sl),
        this.bookService.wholeBooks.splice(this.currentBook.sl - 1, 1, book);
      this.bookService.saveDb();
    }
  }
}
