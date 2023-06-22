import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  tableHeaders: string[] = ['Title', 'Description', 'Page Count', 'Excerpt', 'Publish Date', 'Action'];
  searchQuery: string = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  create(): void {
    this.router.navigate(['book/create']);
  }

  update(id: number): void {
    this.router.navigate(['book/update', id]);
  }

  fetchBooks(): void {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }

  deleteBook(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete) {
      this.bookService.deleteBook(id).subscribe(
        (response) => {
          console.log('Book deleted successfully');
          this.fetchBooks();
        },
        (error) => {
          console.log('Error deleting book:', error);
        }
      );
    }
  }
  
  search(): void {
    this.bookService.searchBooks(this.searchQuery).subscribe(
      (response: any) => {
        this.books = response;
      },
      (error: any) => {
        console.log('Error searching books:', error);
      }
    );
  }
}
