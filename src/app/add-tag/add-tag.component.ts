import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BookService } from '../book.service';
@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrl: './add-tag.component.scss',
})
export class AddTagComponent implements OnInit {
  addOnBlur = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public currentBook: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { book: any },
    private bookService: BookService
  ) {}

  tagForm = new FormGroup({
    bookTags: new FormControl(''),
  });

  tags: any = [];

  ngOnInit() {
    this.currentBook = this.data.book;
    this.tags = [];
    this.data.book.tags.forEach((tag: any) => {
      this.tags.push({ name: tag });
    });
    // console.log(this.currentBook, 'currentBook');
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push({ name: value });
    }
    this.tagForm.controls['bookTags'].setValue(this.tags);
    event.chipInput!.clear();
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.tagForm.controls['bookTags'].setValue(this.tags);
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
    this.tagForm.controls['bookTags'].setValue(this.tags);
  }

  // submit
  addTag() {
    let currentTags: any = this.tagForm.value.bookTags;
    // console.log(currentTags, 'currentTags');

    let id = this.currentBook.sl - 1;
    let updateTags: any = [];
    currentTags.forEach((tag: any) => {
      updateTags.push(tag.name);
    });
    // console.log(updateTags, 'updateTags');

    this.bookService.wholeBooks[id].tags = updateTags;
  }
}
